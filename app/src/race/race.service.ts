import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Race } from './entities/race.entity';
import { RaceDto } from './dto/race.dto';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class RaceService {

    constructor(
        @InjectRepository(Race)
        private readonly raceRepository: Repository<Race>) {}

    // Method to create a new race
    async createRace(createRaceDto: RaceDto): Promise<Race> {
        try {
            const race = this.raceRepository.create(createRaceDto);
            return await this.raceRepository.save(race);
        } catch (error) {
            throw new BadRequestException('Failed to create race');
        }
    }

    // Method to find all races
    async findAllRaces(): Promise<Race[]> {
        return await this.raceRepository.find();
    }
    // Method to find all active races
    async findAllActiveRaces(): Promise<Race[]> {
        return await this.raceRepository.find({ where: { isActive: true } });
    }   
    // Method to get a race by ID
    async FindRaceById(id: number): Promise<Race> {
        try {
            const race = await this.raceRepository.findOne({ where: {
                id_race: id } });
            if (!race) {
                throw new NotFoundException(`Race with ID "${id}" not found`);
            }
            return race;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding race');
        }
    }

    //Method to update a race by ID
    async updateRace(id: number, updateRaceDto: RaceDto): Promise<Race>{
        try {
            const race = await this.FindRaceById(id);
            Object.assign(race, updateRaceDto);
            return await this.raceRepository.save(race);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
        throw new InternalServerErrorException('Error updating race');
        }
    }

    //Method to soft-delete an race by ID
    async softDeleteRace(id: number): Promise<Race>{
        try {
            const race = await this.FindRaceById(id);
            race.isActive = false;
            return await this.raceRepository.save(race);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting race'); 
        }
    }
}
