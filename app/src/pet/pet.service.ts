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

import { PetUser } from '../pet_user/entities/pet_user.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,

        @InjectRepository(PetUser)
        private readonly petUserRepository: Repository<PetUser>,

        private readonly storageService: SupabaseStorageService,
    ) { }

    // -------------------------------------------------------
    // CREATE PET FOR USER with optional image upload
    // -------------------------------------------------------
    async createPet(
        userId: number,
        createPetDto: PetDto,
        file?: Express.Multer.File,
    ): Promise<Pet> {
        try {
            const { id_race, id_animal, ...rest } = createPetDto;

            const pet = this.petRepository.create({
                ...rest,
                isActive: rest.isActive ?? true,
                race: { id_race } as any,
                animal: { id_animal } as any,
            });

            // If image was uploaded, upload it and store its URL
            if (file) {
                const imageUrl = await this.storageService.uploadImage(file);
                pet.image_url = imageUrl;
            }
            // Creates pet and link into pet_user table
            const savedPet = await this.petRepository.save(pet);
            const link = this.petUserRepository.create({
                user: { id_user: userId } as User,
                pet: { id_pet: savedPet.id_pet } as Pet,
                isActive: true
            } as any);
            await this.petUserRepository.save(link);
            return savedPet;
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create pet');
        }
    }
    // -------------------------------------------------------
    // GET MY PETS (by pet_user)
    // -------------------------------------------------------
    async findMyPets(userId: number): Promise<Pet[]> {
        try {
            const rows = await this.petUserRepository.find({
                where: {
                    user: { id_user: userId } as any,
                    isActive: true,
                } as any,
                relations: {
                    pet: true,
                } as any,
            });
            return rows
                .map((rows: any) => rows.pet)
                .filter(Boolean);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error retrieving user pets');
        }
    }

    async findMyActivePets(userId: number): Promise<Pet[]> {
        try {
            const rows = await this.petUserRepository.find({
                where: {
                    user: { id_user: userId } as any,
                    isActive: true,
                    pet: { isActive: true } as any,
                } as any,
                relations: { pet: true } as any,
            });
            return rows.map((r: any) => r.pet).filter(Boolean);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error retrieving active user pets');
        }
    }

    // -------------------------------------------------------
    // GET ALL PETS ( ADMIN )
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
