import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';
import { UpdatePetDto } from './dto/update-pet';
import { SupabaseStorageService } from 'src/storage/storage.service';

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,

        private readonly storageService: SupabaseStorageService,
    ) { }

    // -------------------------------------------------------
    // CREATE PET with optional image upload
    // -------------------------------------------------------
    async createPet(
        createPetDto: PetDto,
        file?: Express.Multer.File,
    ): Promise<Pet> {
        try {
            const { id_race, id_animal, ...rest } = createPetDto;

            const pet = this.petRepository.create({
                ...rest,
                race: { id_race } as any,
                animal: { id_animal } as any,
            });

            // If an image was uploaded, upload it and store its URL
            if (file) {
                const imageUrl = await this.storageService.uploadImage(file);
                pet.image_url = imageUrl;
            }

            return await this.petRepository.save(pet);
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create pet');
        }
    }

    // -------------------------------------------------------
    // GET ALL PETS
    // -------------------------------------------------------
    async findAllPets(): Promise<Pet[]> {
        return await this.petRepository.find();
    }

    // -------------------------------------------------------
    // GET ACTIVE PETS
    // -------------------------------------------------------
    async findAllActivePets(): Promise<Pet[]> {
        return await this.petRepository.find({ where: { isActive: true } });
    }

    // -------------------------------------------------------
    // FIND PET BY ID
    // -------------------------------------------------------
    async FindPetById(id: number): Promise<Pet> {
        try {
            const pet = await this.petRepository.findOne({
                where: { id_pet: id },
            });

            if (!pet) {
                throw new NotFoundException(`Pet with ID "${id}" not found`);
            }

            return pet;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error finding pet');
        }
    }

    // -------------------------------------------------------
    // UPDATE PET with optional new image
    // -------------------------------------------------------
    async updatePet(
        id: number,
        updatePetDto: UpdatePetDto,
        file?: Express.Multer.File,
    ): Promise<Pet> {
        try {
            const pet = await this.FindPetById(id);

            // Update normal fields
            Object.assign(pet, updatePetDto);

            // If a new image is uploaded, replace it
            if (file) {
                const newImageUrl = await this.storageService.uploadImage(file);
                pet.image_url = newImageUrl;
            }

            return await this.petRepository.save(pet);
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error updating pet');
        }
    }

    // -------------------------------------------------------
    // SOFT DELETE PET
    // -------------------------------------------------------
    async softDeletePet(id: number): Promise<Pet> {
        try {
            const pet = await this.FindPetById(id);
            pet.isActive = false;
            return await this.petRepository.save(pet);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error deleting pet');
        }
    }
}
