import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dto/clinic.dto';

@Injectable()
export class ClinicService {
    constructor(
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
    ) {}

    // Method to create a new clinic
    async createClinic(createClinicDto: ClinicDto): Promise<Clinic> {
        try {
            const clinic = this.clinicRepository.create(createClinicDto);
            return await this.clinicRepository.save(clinic);
        } catch (error) {
            throw new BadRequestException('Failed to create clinic');
        }
    }

    // Method to find all clinics
    async findAllClinics(): Promise<Clinic[]> {
        return await this.clinicRepository.find();
    }

    // Method to find all active clinics  
    async findAllActiveClinics(): Promise<Clinic[]> {
        return await this.clinicRepository.find({ where: { isActive: true } });
    }

    // Method to get a clinic by ID
    async FindClinicById(id: number): Promise<Clinic> {
        try {
            const clinic = await this.clinicRepository.findOne({ where: { id_clinic: id } });
            if (!clinic) {
                throw new NotFoundException(`Clinic with ID "${id}" not found`);
            }
            return clinic;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }   
            throw new InternalServerErrorException('Error finding clinic');
        }
    }

    //Method to update a clinic by ID
    async updateClinic(id: number, updateClinicDto: ClinicDto): Promise<Clinic> {
        try {
            const clinic = await this.FindClinicById(id);
            Object.assign(clinic, updateClinicDto);
            return await this.clinicRepository.save(clinic);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating clinic');
        }
    }

    //Method to soft delete a clinic by ID (set isActive = false)
    async softDeleteClinic(id: number): Promise<Clinic> {
        try {
            const clinic = await this.FindClinicById(id);
            clinic.isActive = false;
            return await this.clinicRepository.save(clinic);
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting clinic');
        }
    }
}
