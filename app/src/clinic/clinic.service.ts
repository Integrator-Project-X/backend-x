import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dto/clinic.dto';
import { SupabaseStorageService } from 'src/storage/storage.service';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicService {
    constructor(
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,

        private readonly storageService: SupabaseStorageService,
    ) { }

    // -------------------------------------------------------
    // CREATE CLINIC (imagen opcional)
    // -------------------------------------------------------
    async createClinic(
        createClinicDto: ClinicDto,
        file?: Express.Multer.File,
    ): Promise<Clinic> {
        try {
            const clinic = this.clinicRepository.create(createClinicDto);

            // If an image was uploaded, upload it and store its URL
            if (file) {
                const imageUrl = await this.storageService.uploadImage(file);
                clinic.image_url = imageUrl;
            }

            return await this.clinicRepository.save(clinic);
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create clinic');
        }
    }

    // -------------------------------------------------------
    // GET ALL CLINICS
    // -------------------------------------------------------
    async findAllClinics(): Promise<Clinic[]> {
        return await this.clinicRepository.find();
    }

    // -------------------------------------------------------
    // GET ACTIVE CLINICS
    // -------------------------------------------------------
    async findAllActiveClinics(): Promise<Clinic[]> {
        return await this.clinicRepository.find({ where: { isActive: true } });
    }

    // -------------------------------------------------------
    // FIND CLINIC BY ID
    // -------------------------------------------------------
    async FindClinicById(id: number): Promise<Clinic> {
        try {
            const clinic = await this.clinicRepository.findOne({
                where: { id_clinic: id },
            });

            if (!clinic) {
                throw new NotFoundException(`Clinic with ID "${id}" not found`);
            }

            return clinic;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding clinic');
        }
    }

    // -------------------------------------------------------
    // UPDATE CLINIC (imagen opcional)
    // -------------------------------------------------------
    async updateClinic(
        id: number,
        updateClinicDto: UpdateClinicDto,
        file?: Express.Multer.File,
    ): Promise<Clinic> {
        try {
            const clinic = await this.FindClinicById(id);

            // Actualizamos campos normales
            Object.assign(clinic, updateClinicDto);

            // Si viene una nueva imagen, la subimos y cambiamos la URL
            if (file) {
                const newImageUrl = await this.storageService.uploadImage(file);
                clinic.image_url = newImageUrl;
            }

            return await this.clinicRepository.save(clinic);
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating clinic');
        }
    }

    // -------------------------------------------------------
    // SOFT DELETE CLINIC
    // -------------------------------------------------------
    async softDeleteClinic(id: number): Promise<Clinic> {
        try {
            const clinic = await this.FindClinicById(id);
            clinic.isActive = false;
            return await this.clinicRepository.save(clinic);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting clinic');
        }
    }
}
