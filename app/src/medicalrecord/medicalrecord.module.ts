import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalrecordController } from './medicalrecord.controller';
import { MedicalrecordService } from './medicalrecord.service';
import { MedicalRecord } from './entities/medicalrecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  controllers: [MedicalrecordController],
  providers: [MedicalrecordService],
})
export class MedicalrecordModule {}