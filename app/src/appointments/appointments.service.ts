import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import type { JwtUser } from 'src/auth/strategies/jwt.strategy';

import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/users/entities/user.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { AppointmentStatus } from 'src/appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes } from 'src/appointmentstypes/entities/appointments_types.entity';
import { Diagnosis } from 'src/diagnosis/entities/diagnosis.entity';
import { Personal } from 'src/personal/entities/personal.entity';
import { PetUser } from 'src/pet_user/entities/pet_user.entity';

import { STATUS } from 'src/appointmentstatus/constants/status.constants';

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
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @InjectRepository(PetUser)
    private readonly petUserRepository: Repository<PetUser>,
  ) { }

  private async findAppointmentById(id: number): Promise<Appointment> {
    const appt = await this.appointmentRepository.findOne({ where: { id_appointment: id } });
    if (!appt) throw new NotFoundException(`Appointment with ID "${id}" not found`);
    return appt;
  }

  private async findStatusByNameOrThrow(name: string): Promise<AppointmentStatus> {
    const status = await this.statusRepository.findOne({
      where: { status_name: ILike(name) },
    });
    if (!status) {
      throw new InternalServerErrorException(`AppointmentStatus "${name}" is missing in DB`);
    }
    return status;
  }

  async createForClient(user: JwtUser, dto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const pet = await this.petRepository.findOne({ where: { id_pet: dto.id_pet } });
      if (!pet) throw new BadRequestException(`Pet with ID "${dto.id_pet}" does not exist`);
      const ownsPet = await this.petUserRepository.exist({
        where: {
          user: { id_user: user.userId } as any,
          pet: { id_pet: dto.id_pet } as any,
        } as any,
      });
      if (!ownsPet && user.role !== 'ADMIN') {
        throw new ForbiddenException('You do not own this pet');
      }
      const clinic = await this.clinicRepository.findOne({ where: { id_clinic: dto.id_clinic } });
      if (!clinic) {
        throw new BadRequestException(`Clinic with ID "${dto.id_clinic}" does not exist`);
      }
      const type = await this.typeRepository.findOne({ where: { id: dto.id_type } });
      if (!type) {
        throw new BadRequestException(`Appointment type with ID "${dto.id_type}" does not exist`);
      }
      const apptUser = await this.userRepository.findOne({ where: { id_user: user.userId } });
      if (!apptUser) {
        throw new BadRequestException(`User with ID "${user.userId}" does not exist`);
      }
      const pending = await this.findStatusByNameOrThrow(STATUS.PENDIENTE);
      const appointment = this.appointmentRepository.create({
        pet,
        user: apptUser,
        clinic,
        type,
        status: pending,
        diagnosis: null,
        description: dto.description ?? null,
        isActive: true,
      });
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) throw error;
      throw new InternalServerErrorException('Error creating appointment');
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
  
  async findMine(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { user: { id_user: userId } as any } as any,
    });
  }

  async findForClinic(user: JwtUser): Promise<Appointment[]> {
    if (!user.clinicId) throw new BadRequestException('Missing clinicId in token for VET');
    return this.appointmentRepository.find({
      where: { clinic: { id_clinic: user.clinicId } as any } as any,
    });
  }

  async findOne(id: number): Promise<Appointment> {
    return this.findAppointmentById(id);
  }

  async cancel(id: number): Promise<Appointment> {
    const appt = await this.findAppointmentById(id);
    const current = appt.status?.status_name;
    if (current && [STATUS.COMPLETADA, STATUS.CANCELADA].includes(current as any)) {
      throw new BadRequestException(`Appointment cannot be cancelled from status "${current}"`);
    }
    appt.status = await this.findStatusByNameOrThrow(STATUS.CANCELADA);
    return this.appointmentRepository.save(appt);
  }

  async setStatus(id: number, statusId: number): Promise<Appointment> {
    const appt = await this.findAppointmentById(id);
    const status = await this.statusRepository.findOne({
      where: { id_appointment_status: statusId },
    });
    if (!status) {
      throw new BadRequestException(`Status with ID "${statusId}" does not exist`);
    }
    appt.status = status;
    return this.appointmentRepository.save(appt);
  }

  async createDiagnosisForAppointment( appointmentId: number, dto: { id_personal: number; description: string },
  ): Promise<Appointment> {
    const appt = await this.findAppointmentById(appointmentId);
    const personal = await this.personalRepository.findOne({
      where: { id_personal: dto.id_personal } as any,
    });
    if (!personal) {
      throw new BadRequestException(`Personal with ID "${dto.id_personal}" does not exist`);
    }
    const diagnosis = this.diagnosisRepository.create({
      description: dto.description,
      personal,
      isActive: true,
    });
    const saved = await this.diagnosisRepository.save(diagnosis);
    appt.diagnosis = saved;
    return this.appointmentRepository.save(appt);
  }

  async updateAppointment(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    return this.findAppointmentById(id);
  }
}