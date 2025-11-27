import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentStatus } from './entities/appointmentstatus.entity';
import { AppointmentstatusDto } from './dto/appointmentstatus.dto';

@Injectable()
export class AppointmentstatusService {
    constructor(
        @InjectRepository(AppointmentStatus)
        private readonly appointmentstatusRepository: Repository<AppointmentStatus>,
    ) { }

    // Method to create a new appointment status
    async createAppointmentStatus(createAppointmentstatusDto: AppointmentstatusDto): Promise<AppointmentStatus> {
        try {
            const appointmentStatus = this.appointmentstatusRepository.create(createAppointmentstatusDto);
            return await this.appointmentstatusRepository.save(appointmentStatus);
        } catch (error) {
            throw new BadRequestException('Failed to create appointment status');
        }
    }
    // Method to find all appointment statuses
    async findAllAppointmentStatuses(): Promise<AppointmentStatus[]> {
        return await this.appointmentstatusRepository.find();
    }
    // Method to find all active appointment statuses  
    async findAllActiveAppointmentStatuses(): Promise<AppointmentStatus[]> {
        return await this.appointmentstatusRepository.find({ where: { isActive: true } });
    }

    // Method to get an appointment status by ID
    async FindAppointmentStatusById(id: number): Promise<AppointmentStatus> {
        try {
            const appointmentStatus = await this.appointmentstatusRepository.findOne({ where: { id_appointment_status: id } });
            if (!appointmentStatus) {
                throw new NotFoundException(`Appointment status with ID "${id}" not found`);
            }
            return appointmentStatus;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding appointment status');
        }
    }


    //Method to update an appointment status by ID
    async updateAppointmentStatus(id: number, updateAppointmentstatusDto: AppointmentstatusDto): Promise<AppointmentStatus> {
        try {
            const appointmentStatus = await this.FindAppointmentStatusById(id);
            Object.assign(appointmentStatus, updateAppointmentstatusDto);
            return await this.appointmentstatusRepository.save(appointmentStatus);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating appointment status');
        }
    }

    // Method to soft-delete an appointment status by ID
    async softDeleteAppointmentStatus(id: number): Promise<void> {
        try {
            const appointmentStatus = await this.FindAppointmentStatusById(id);
            appointmentStatus.isActive = false;
            await this.appointmentstatusRepository.save(appointmentStatus);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting appointment status');
        }
    }

    //
}
