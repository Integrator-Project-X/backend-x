import { Module } from '@nestjs/common';
import { AppointmentstypesController } from './appointmentstypes.controller';
import { AppointmentstypesService } from './appointmentstypes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsTypes } from './entities/appointments_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentsTypes])],
  controllers: [AppointmentstypesController],
  providers: [AppointmentstypesService]
})
export class AppointmentstypesModule {}
