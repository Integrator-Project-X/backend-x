import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosition } from './entities/jobposition.entity';
import { JobPositionDto } from './dto/jobposition.dto';

@Injectable()
export class JobpositionService {

    constructor(
        @InjectRepository(JobPosition)
        private readonly jobpositionRepository: Repository<JobPosition>,
    ) { }

    //Method to create a new job position
    async createJobPosition(createJobpositionDto: JobPositionDto): Promise<JobPosition> {
        try {
            const jobPosition = this.jobpositionRepository.create(createJobpositionDto);
            return await this.jobpositionRepository.save(jobPosition);
        } catch (error) {
            throw new Error('Failed to create job position');
        }
    }

    //Method to find all job positions
    async findAllJobPositions(): Promise<JobPosition[]> {
        return await this.jobpositionRepository.find();
    }

    //Method to find all active job positions
    async findAllActiveJobPositions(): Promise<JobPosition[]> {
        return await this.jobpositionRepository.find({ where: { isActive: true } });
    }

    //Method to get a job position by ID
    async findJobPositionById(id: number): Promise<JobPosition> {
        try {
            const jobPosition = await this.jobpositionRepository.findOne({ where: { id_job_position: id } });
            if (!jobPosition) {
                throw new Error(`Job position with ID "${id}" not found`);
            }
            return jobPosition;
        } catch (error) {
            throw new Error('Error finding job position');
        }
    }

    //Method to update a job position by ID
    async updateJobPosition(id: number, updateJobpositionDto: JobPositionDto): Promise<JobPosition> {
        try {
            const jobPosition = await this.findJobPositionById(id);
            Object.assign(jobPosition, updateJobpositionDto);
            return await this.jobpositionRepository.save(jobPosition);
        } catch (error) {
            throw new Error('Error updating job position');
        }
    }

    //Method to soft-delete a job position by ID
    async softDeleteJobPosition(id: number): Promise<void> {
        try {
            const jobPosition = await this.findJobPositionById(id);
            jobPosition.isActive = false;
            await this.jobpositionRepository.save(jobPosition);
        } catch (error) {
            throw new Error('Error deleting job position');
        }
    }
}
