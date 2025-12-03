import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis } from './entities/diagnosis.entity';
import { DiagnosisDto } from './dto/diagnosis.dto';

@Injectable()
export class DiagnosisService {
    constructor(
        @InjectRepository(Diagnosis)
        private readonly diagnosisRepository: Repository<Diagnosis>,
    )
    {}

    // Method to create a new diagnosis
    async createDiagnosis(createDiagnosisDto: DiagnosisDto): Promise<Diagnosis> {
        try {
            const {id_personal, ...rest} = createDiagnosisDto;
            const diagnosis = this.diagnosisRepository.create({...rest,
                personal: {id_personal} as any,
            });
            return await this.diagnosisRepository.save(diagnosis);
        } catch (error) {
            throw new BadRequestException('Failed to create diagnosis');
        }
    }

    // Method to find all diagnoses
    async findAllDiagnoses(): Promise<Diagnosis[]> {
        return await this.diagnosisRepository.find();
    }

    // Method to find all active diagnoses  
    async findAllActiveDiagnoses(): Promise<Diagnosis[]> {
        return await this.diagnosisRepository.find({ where: { isActive: true } });
    }

    // Method to get a diagnosis by ID
    async FindDiagnosisById(id: number): Promise<Diagnosis> {
        try {
            const diagnosis = await this.diagnosisRepository.findOne({ where: { id_diagnosis: id } });
            if (!diagnosis) {
                throw new NotFoundException(`Diagnosis with ID "${id}" not found`);
            }
            return diagnosis;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding diagnosis');
        }
    }

    //Method to update a diagnosis by ID
    async updateDiagnosis(id: number, updateDiagnosisDto: DiagnosisDto): Promise<Diagnosis> {
        try {
            const diagnosis = await this.FindDiagnosisById(id);
            Object.assign(diagnosis, updateDiagnosisDto);
            return await this.diagnosisRepository.save(diagnosis);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating diagnosis');
        }
    }

    //Method to soft-delete a diagnosis by ID
    async softDeleteDiagnosis(id: number): Promise<Diagnosis> {
        try {
            const diagnosis = await this.FindDiagnosisById(id);
            diagnosis.isActive = false;
            return await this.diagnosisRepository.save(diagnosis);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting diagnosis');
        }
    }
}
