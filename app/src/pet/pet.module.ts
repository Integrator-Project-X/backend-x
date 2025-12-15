import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PetUser } from 'src/pet_user/entities/pet_user.entity';
import { OwnershipService } from 'src/auth/ownership/ownership.service';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetUser, Appointment])],
  controllers: [PetController],
  providers: [PetService, OwnershipService, OwnershipGuard]
})
export class PetModule {}
