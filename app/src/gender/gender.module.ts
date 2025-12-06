// module structure for gender
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  controllers: [GenderController],
  providers: [GenderService],
  exports: [GenderService],
})
export class GenderModule {}
