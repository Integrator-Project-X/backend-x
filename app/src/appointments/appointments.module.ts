import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/users/entities/user.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { AppointmentStatus } from 'src/appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes } from 'src/appointmentstypes/entities/appointments_types.entity';
import { Diagnosis } from 'src/diagnosis/entities/diagnosis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Pet,
      User,
      Clinic,
      AppointmentStatus,
      AppointmentsTypes,
      Diagnosis,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule { }