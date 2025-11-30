import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';


@Injectable()
export class PetService {

    constructor(
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,
    ) {} 

    //Method to create a new pet
    async createPet(createPetDto: PetDto): Promise<Pet> {
        try {
            const {id_race, id_animal, ...rest} = createPetDto;
            const pet = this.petRepository.create({...rest,
                race: {id_race} as any,
                animal: {id_animal} as any
            });
            return await this.petRepository.save(pet);
        } catch (error) {
            throw new BadRequestException('Failed to create pet');
        }
    }

    //Method to find all pets
    async findAllPets(): Promise<Pet[]> {
        return await this.petRepository.find();
    }

    //Method to find all active pets  
    async findAllActivePets(): Promise<Pet[]> {
        return await this.petRepository.find({ where: { isActive: true } });
    }

    // Method to get a pet by ID
    async FindPetById(id: number): Promise<Pet> {
        try {
            const pet = await this.petRepository.findOne({ where: { id_pet: id } });
            if (!pet) {
                throw new NotFoundException(`Pet with ID "${id}" not found`);
            }
            return pet;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding pet');
        }
    }

    //Method to update a pet by ID
    async updatePet(id: number, updatePetDto: PetDto): Promise<Pet> {
        try {
            const pet = await this.FindPetById(id);
            Object.assign(pet, updatePetDto);
            return await this.petRepository.save(pet);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }   
            throw new InternalServerErrorException('Error updating pet');
        }
    }

    //Method to soft delete a pet by ID (set isActive = false)
    async softDeletePet(id: number): Promise<Pet> {
        try {
            const pet = await this.FindPetById(id);
            pet.isActive = false;
            return await this.petRepository.save(pet);
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }   
            throw new InternalServerErrorException('Error deleting pet');
        }
    }
}
