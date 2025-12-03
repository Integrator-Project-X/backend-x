import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { Personal } from './entities/personal.entity';
import { User } from 'src/users/entities/user.entity';
import { JobPosition } from 'src/jobposition/entities/jobposition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personal, User, JobPosition])],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService],
})
export class PersonalModule {}