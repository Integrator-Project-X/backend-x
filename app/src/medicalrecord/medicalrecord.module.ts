import { Module } from '@nestjs/common';
import { MedicalrecordController } from './medicalrecord.controller';
import { MedicalrecordService } from './medicalrecord.service';

@Module({
  controllers: [MedicalrecordController],
  providers: [MedicalrecordService]
})
export class MedicalrecordModule {}
