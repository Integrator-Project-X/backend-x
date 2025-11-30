import { Module } from '@nestjs/common';
import { ClinicScheduleService } from './clinic_schedule.service';
import { ClinicScheduleController } from './clinic_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicSchedule } from './entities/clinic_schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicSchedule])],
  providers: [ClinicScheduleService],
  controllers: [ClinicScheduleController]
})
export class ClinicScheduleModule {}
