import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PetUser } from 'src/pet_user/entities/pet_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetUser])],
  controllers: [PetController],
  providers: [PetService]
})
export class PetModule {}
