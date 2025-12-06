import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PetUserController } from './pet_user.controller';
import { PetUserService } from './pet_user.service';
import { PetUser } from './entities/pet_user.entity';
import { User } from 'src/users/entities/user.entity';
import { Pet } from 'src/pet/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetUser, User, Pet])],
  controllers: [PetUserController],
  providers: [PetUserService],
  exports: [PetUserService],
})
export class PetUserModule { }