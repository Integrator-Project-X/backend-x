import { Module } from '@nestjs/common';
import { AppointmentstatusController } from './appointmentstatus.controller';
import { AppointmentstatusService } from './appointmentstatus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentStatus } from './entities/appointmentstatus.entity';


@Module({
  imports: [TypeOrmModule.forFeature([AppointmentStatus])],
  controllers: [AppointmentstatusController],
  providers: [AppointmentstatusService]
})
export class AppointmentstatusModule {}
