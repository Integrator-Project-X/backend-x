import { MedicalRecord } from './entities/medicalrecord.entity';
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecordDto } from './dto/medicalrecord.dto';
import { UpdateMedicalRecordDto } from './dto/update-medicalrecord.dto';


@Injectable()
export class MedicalrecordService {
    constructor(
        @InjectRepository(MedicalRecord)
        private readonly medicalRecordRepository: Repository<MedicalRecord>,
    ) {}

    // Create a new medical record
    async createMedicalRecord(medicalRecordDto: MedicalRecordDto): Promise<MedicalRecord> {
        try {
            const newMedicalRecord = this.medicalRecordRepository.create(medicalRecordDto);
            return await this.medicalRecordRepository.save(newMedicalRecord);
        } catch (error) {
            throw new BadRequestException('Error creating medical record');
        }
    }


    // Get all medical records
    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        try {
            return await this.medicalRecordRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving medical records');
        }
    }

    // Get medical record by ID
    async getMedicalRecordById(id: number): Promise<MedicalRecord> {
        const medicalRecord = await this.medicalRecordRepository.findOneBy({ id });
        if (!medicalRecord) {
            throw new NotFoundException(`Medical record with ID ${id} not found`);
        }
        return medicalRecord;
    }
    // Update medical record
    async updateMedicalRecord(
        id: number,
        updateMedicalRecordDto: UpdateMedicalRecordDto,
    ): Promise<MedicalRecord> {
        const medicalRecord = await this.getMedicalRecordById(id);
        Object.assign(medicalRecord, updateMedicalRecordDto);
        try {
            return await this.medicalRecordRepository.save(medicalRecord);
        } catch (error) {
            throw new InternalServerErrorException('Error updating medical record');
        }
    }

    // Soft-delete medical record
    async softDeleteMedicalRecord(id: number): Promise<void> {
        const medicalRecord = await this.getMedicalRecordById(id);
        medicalRecord.isActive = false;
        try {
            await this.medicalRecordRepository.save(medicalRecord);
        } catch (error) {
            throw new InternalServerErrorException('Error deleting medical record');
        }
    }
}
