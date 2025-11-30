import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicSchedule } from './entities/clinic_schedule.entity';
import { ClinicScheduleDto } from './dto/clinic_schedule.dto';

@Injectable()
export class ClinicScheduleService {
    constructor(
        @InjectRepository(ClinicSchedule)
        private readonly clinicScheduleRepository: Repository<ClinicSchedule>,
    ) {}

    // Method to create a new clinic schedule
    async createClinicSchedule(createClinicScheduleDto: ClinicScheduleDto): Promise<ClinicSchedule> {
        try {
            const {id_clinic, ...rest} = createClinicScheduleDto;
            const clinicSchedule = this.clinicScheduleRepository.create({...rest,
                clinic: {id_clinic} as any,
            });
            return await this.clinicScheduleRepository.save(clinicSchedule);
        } catch (error) {
            throw new BadRequestException('Failed to create clinic schedule');
        }
    }

    // Method to find all clinic schedules
    async findAllClinicSchedules(): Promise<ClinicSchedule[]> {
        return await this.clinicScheduleRepository.find();
    }

    // Method to find all active clinic schedules  
    async findAllActiveClinicSchedules(): Promise<ClinicSchedule[]> {
        return await this.clinicScheduleRepository.find({ where: { isActive: true } });
    }

    // Method to get a clinic schedule by ID
    async FindClinicScheduleById(id: number): Promise<ClinicSchedule> {
        try {
            const clinicSchedule = await this.clinicScheduleRepository.findOne({ where: { id_clinic_schedule: id } });
            if (!clinicSchedule) {
                throw new NotFoundException(`Clinic Schedule with ID "${id}" not found`);
            }
            return clinicSchedule;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }   
            throw new InternalServerErrorException('Error finding clinic schedule');
        }
    }

    //Method to update a clinic schedule by ID
    async updateClinicSchedule(id: number, updateClinicScheduleDto: ClinicScheduleDto): Promise<ClinicSchedule> {
        try {
            const clinicSchedule = await this.FindClinicScheduleById(id);
            Object.assign(clinicSchedule, updateClinicScheduleDto);
            return await this.clinicScheduleRepository.save(clinicSchedule);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating clinic schedule');
        }
    }

    //Method to soft-delete an animal by ID
    async softDeleteClinicSchedule(id: number): Promise<ClinicSchedule> {
        try {
            const clinicSchedule = await this.FindClinicScheduleById(id);
            clinicSchedule.isActive = false;
            return await this.clinicScheduleRepository.save(clinicSchedule);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting clinic schedule');
        }
    }
}
