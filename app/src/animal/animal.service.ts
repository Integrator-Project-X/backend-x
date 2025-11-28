import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { AnimalDto } from './dto/animal.dto';

@Injectable()
export class AnimalService {
    constructor(
        @InjectRepository(Animal)
        private readonly animalRepository: Repository<Animal>,
    ) { }

    // Method to create a new animal
    async createAnimal(createAnimalDto: AnimalDto): Promise<Animal> {
        try {
            const animal = this.animalRepository.create(createAnimalDto);
            return await this.animalRepository.save(animal);
        } catch (error) {
            throw new BadRequestException('Failed to create animal');
        }
    }

    // Method to find all animals
    async findAllAnimals(): Promise<Animal[]> {
        return await this.animalRepository.find();
    }

    // Method to find all active animals  
    async findAllActiveAnimals(): Promise<Animal[]> {
        return await this.animalRepository.find({ where: { isActive: true } });
    }

    // Method to get an animal by ID
    async FindAnimalByid(id:number): Promise<Animal>{
        try{
            const animal = await this.animalRepository.findOne({ where: {id_animal:id}});
            if(!animal){
                throw new NotFoundException(`Animal with ID "${id}" not found`);
            }
            return animal;
        }catch (error){
            if(error instanceof NotFoundException){
                throw error;
            }
            throw new InternalServerErrorException('Error finding animal');
        }
    }

    //Method to update an animal by ID
    async updateAnimal(id:number, updateAnimalDto:AnimalDto):Promise<Animal>{
        try{
            const animal = await this.FindAnimalByid(id);
            Object.assign(animal, updateAnimalDto);
            return await this.animalRepository.save(animal);
        } catch (error){
            if(error instanceof NotFoundException){
                throw error;
            }
            throw new InternalServerErrorException('Error updating animal');
        }
    }

    //Method to soft-delete an animal by ID
    async softDeleteAnimal(id:number):Promise<Animal>{
        try{
            const animal =  await this.FindAnimalByid(id);
            animal.isActive = false;
            return await this.animalRepository.save(animal);
        } catch (error){
            if(error instanceof NotFoundException){
                throw error;
            }
            throw new InternalServerErrorException('Error deleting animal');
        }
    }
}
