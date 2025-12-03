import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentDto } from './dto/appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/users/entities/user.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { AppointmentStatus } from 'src/appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes } from 'src/appointmentstypes/entities/appointments_types.entity';
import { Diagnosis } from 'src/diagnosis/entities/diagnosis.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,

    @InjectRepository(AppointmentStatus)
    private readonly statusRepository: Repository<AppointmentStatus>,

    @InjectRepository(AppointmentsTypes)
    private readonly typeRepository: Repository<AppointmentsTypes>,

    @InjectRepository(Diagnosis)
    private readonly diagnosisRepository: Repository<Diagnosis>,
  ) { }

  private async findAppointmentById(id: number): Promise<Appointment> {
    const appt = await this.appointmentRepository.findOne({
      where: { id_appointment: id },
    });

    if (!appt) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    return appt;
  }

  async createAppointment(dto: AppointmentDto): Promise<Appointment> {
    try {
      const pet = await this.petRepository.findOne({
        where: { id_pet: dto.id_pet },
      });
      if (!pet) {
        throw new BadRequestException(
          `Pet with ID "${dto.id_pet}" does not exist`,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id_user: dto.id_user },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID "${dto.id_user}" does not exist`,
        );
      }

      const clinic = await this.clinicRepository.findOne({
        where: { id_clinic: dto.id_clinic },
      });
      if (!clinic) {
        throw new BadRequestException(
          `Clinic with ID "${dto.id_clinic}" does not exist`,
        );
      }

      const status = await this.statusRepository.findOne({
        where: { id_appointment_status: dto.id_status },
      });
      if (!status) {
        throw new BadRequestException(
          `Status with ID "${dto.id_status}" does not exist`,
        );
      }

      const type = await this.typeRepository.findOne({
        where: { id: dto.id_type },
      });
      if (!type) {
        throw new BadRequestException(
          `Appointment type with ID "${dto.id_type}" does not exist`,
        );
      }

      let diagnosis: Diagnosis | null = null;
      if (dto.id_diagnosis) {
        diagnosis = await this.diagnosisRepository.findOne({
          where: { id_diagnosis: dto.id_diagnosis },
        });
        if (!diagnosis) {
          throw new BadRequestException(
            `Diagnosis with ID "${dto.id_diagnosis}" does not exist`,
          );
        }
      }

      const appointment = this.appointmentRepository.create({
        pet,
        user,
        clinic,
        status,
        type,
        diagnosis: diagnosis ?? null,
        description: dto.description ?? null,
        isActive: dto.isActive ?? true,
      });

      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error creating appointment');
    }
  }

  async findAll(): Promise<Appointment[]> {
    try {
      return await this.appointmentRepository.find();
    } catch {
      throw new InternalServerErrorException('Error retrieving appointments');
    }
  }

  async findOne(id: number): Promise<Appointment> {
    try {
      return await this.findAppointmentById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving appointment');
    }
  }

  async updateAppointment(
    id: number,
    dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const appointment = await this.findAppointmentById(id);

      if (dto.id_pet) {
        const pet = await this.petRepository.findOne({
          where: { id_pet: dto.id_pet },
        });
        if (!pet) {
          throw new BadRequestException(
            `Pet with ID "${dto.id_pet}" does not exist`,
          );
        }
        (appointment as any).pet = pet;
      }

      if (dto.id_user) {
        const user = await this.userRepository.findOne({
          where: { id_user: dto.id_user },
        });
        if (!user) {
          throw new BadRequestException(
            `User with ID "${dto.id_user}" does not exist`,
          );
        }
        (appointment as any).user = user;
      }

      if (dto.id_clinic) {
        const clinic = await this.clinicRepository.findOne({
          where: { id_clinic: dto.id_clinic },
        });
        if (!clinic) {
          throw new BadRequestException(
            `Clinic with ID "${dto.id_clinic}" does not exist`,
          );
        }
        (appointment as any).clinic = clinic;
      }

      if (dto.id_status) {
        const status = await this.statusRepository.findOne({
          where: { id_appointment_status: dto.id_status },
        });
        if (!status) {
          throw new BadRequestException(
            `Status with ID "${dto.id_status}" does not exist`,
          );
        }
        (appointment as any).status = status;
      }

      if (dto.id_type) {
        const type = await this.typeRepository.findOne({
          where: { id: dto.id_type },
        });
        if (!type) {
          throw new BadRequestException(
            `Appointment type with ID "${dto.id_type}" does not exist`,
          );
        }
        (appointment as any).type = type;
      }

      if (dto.id_diagnosis !== undefined) {
        if (dto.id_diagnosis === null) {
          appointment.diagnosis = null;
        } else {
          const diagnosis = await this.diagnosisRepository.findOne({
            where: { id_diagnosis: dto.id_diagnosis },
          });
          if (!diagnosis) {
            throw new BadRequestException(
              `Diagnosis with ID "${dto.id_diagnosis}" does not exist`,
            );
          }
          (appointment as any).diagnosis = diagnosis;
        }
      }

      if (dto.description !== undefined) {
        appointment.description = dto.description ?? null;
      }

      if (dto.isActive !== undefined) {
        appointment.isActive = dto.isActive;
      }

      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating appointment');
    }
  }

  async softDeleteAppointment(id: number): Promise<Appointment> {
    try {
      const appointment = await this.findAppointmentById(id);
      appointment.isActive = false;
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting appointment');
    }
  }
}