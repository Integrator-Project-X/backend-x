import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentsTypes } from './entities/appointments_types.entity';


@Injectable()
export class AppointmentstypesService {

    constructor(
        @InjectRepository(AppointmentsTypes)
        private readonly appointmentsTypesRepository: Repository<AppointmentsTypes>,
    ) { }


    // Create a new appointment type
    async createAppointmentstypes(name: string): Promise<AppointmentsTypes> {
        try {
            const newAppointmentstypes = this.appointmentsTypesRepository.create({ name });
            return await this.appointmentsTypesRepository.save(newAppointmentstypes);
        } catch (error) {
            throw new BadRequestException('Error creating appointment type');
        }
    }

    // Get all appointment types
    async getAllAppointmentstypes(): Promise<AppointmentsTypes[]> {
        try {
            return await this.appointmentsTypesRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving appointment types');
        }
    }

    // Get appointment type by ID
    async getAppointmentstypesById(id: number): Promise<AppointmentsTypes> {
        const appointmentType = await this.appointmentsTypesRepository.findOneBy({ id });
        if (!appointmentType) {
            throw new NotFoundException(`Appointment type with ID ${id} not found`);
        }
        return appointmentType;
    }

    // Get all active appointment types
    async getActiveAppointmentstypes(): Promise<AppointmentsTypes[]> {
        try {
            return await this.appointmentsTypesRepository.find({ where: { is_active: true } });
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving active appointment types');
        }
    }

    // Update appointment type
    async updateAppointmentstypes(
        id: number,
        name?: string,
        isActive?: boolean,
    ): Promise<AppointmentsTypes> {
        const appointmentType = await this.getAppointmentstypesById(id);
        appointmentType.name = name ?? appointmentType.name;
        appointmentType.is_active = isActive ?? appointmentType.is_active;

        try {
            return await this.appointmentsTypesRepository.save(appointmentType);
        } catch (error) {
            throw new BadRequestException('Error updating appointment type');
        }
    }


    // Delete appointment type
    async deleteAppointmentstypes(id: number): Promise<void> {
        const appointmentType = await this.getAppointmentstypesById(id);
        try {
            await this.appointmentsTypesRepository.remove(appointmentType);
        } catch (error) {
            throw new InternalServerErrorException('Error deleting appointment type');
        }
    }


}
