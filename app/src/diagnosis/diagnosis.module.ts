import { Module } from '@nestjs/common';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './entities/diagnosis.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Diagnosis])],
  controllers: [DiagnosisController],
  providers: [DiagnosisService]
})
export class DiagnosisModule {}
