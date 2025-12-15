import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

// ENTITIES (same as in SeederService)
import { Role } from '../roles/entities/role.entity';
import { Gender } from '../gender/entities/gender.entity';
import { Animal } from '../animal/entities/animal.entity';
import { Race } from '../race/entities/race.entity';
import { AppointmentStatus } from '../appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes } from '../appointmentstypes/entities/appointments_types.entity';
import { JobPosition } from '../jobposition/entities/jobposition.entity';
import { Clinic } from '../clinic/entities/clinic.entity';
import { ClinicSchedule } from '../clinic_schedule/entities/clinic_schedule.entity';

import { User } from '../users/entities/user.entity';
import { Pet } from '../pet/entities/pet.entity';
import { PetUser } from '../pet_user/entities/pet_user.entity';
import { Personal } from '../personal/entities/personal.entity';
import { Access } from '../access/entities/access.entity';
import { Diagnosis } from '../diagnosis/entities/diagnosis.entity';
import { MedicalRecord } from '../medicalrecord/entities/medicalrecord.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Gender,
      Animal,
      Race,
      AppointmentStatus,
      AppointmentsTypes,
      JobPosition,
      Clinic,
      ClinicSchedule,
      User,
      Pet,
      PetUser,
      Personal,
      Access,
      Diagnosis,
      MedicalRecord,
      Appointment,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
