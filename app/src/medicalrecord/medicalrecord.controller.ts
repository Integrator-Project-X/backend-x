import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { MedicalrecordService } from './medicalrecord.service';
import { MedicalRecordDto } from './dto/medicalrecord.dto';
import { UpdateMedicalRecordDto } from './dto/update-medicalrecord.dto';
import { MedicalRecord } from './entities/medicalrecord.entity';

@ApiTags('Medical Records')
@Controller('medical-records')
export class MedicalrecordController {
    constructor(
        private readonly medicalrecordService: MedicalrecordService,
    ) { }

    // -------- CREATE --------
    @Post()
    @ApiOperation({ summary: 'Create a new medical record' })
    @ApiCreatedResponse({
        description: 'Medical record created successfully',
        type: MedicalRecord,
    })
    @ApiBadRequestResponse({
        description: 'Error creating medical record',
    })
    @ApiBody({
        description: 'Medical record payload',
        type: MedicalRecordDto,
        examples: {
            example1: {
                summary: 'Basic medical record example',
                value: {
                    id_pet: 3,
                    id_diagnosis: 7,
                    isActive: true,
                },
            },
        },
    })
    async createMedicalRecord(
        @Body() medicalRecordDto: MedicalRecordDto,
    ): Promise<MedicalRecord> {
        return this.medicalrecordService.createMedicalRecord(medicalRecordDto);
    }

    // -------- GET ALL --------
    @Get()
    @ApiOperation({ summary: 'Get all medical records' })
    @ApiOkResponse({
        description: 'List of all medical records',
        type: MedicalRecord,
        isArray: true,
    })
    @ApiInternalServerErrorResponse({
        description: 'Error retrieving medical records',
    })
    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        return this.medicalrecordService.getAllMedicalRecords();
    }

    // -------- GET BY ID --------
    @Get(':id')
    @ApiOperation({ summary: 'Get a medical record by ID' })
    @ApiParam({
        name: 'id',
        description: 'Medical record ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Medical record found',
        type: MedicalRecord,
    })
    @ApiNotFoundResponse({
        description: 'Medical record not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error retrieving medical record',
    })
    async getMedicalRecordById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<MedicalRecord> {
        return this.medicalrecordService.getMedicalRecordById(id);
    }

    // -------- UPDATE --------
    @Patch(':id')
    @ApiOperation({ summary: 'Update a medical record by ID' })
    @ApiParam({
        name: 'id',
        description: 'Medical record ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Medical record updated successfully',
        type: MedicalRecord,
    })
    @ApiNotFoundResponse({
        description: 'Medical record not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error updating medical record',
    })
    @ApiBody({
        description: 'Fields to update in the medical record',
        type: UpdateMedicalRecordDto,
        examples: {
            example1: {
                summary: 'Update diagnosis of a pet',
                value: {
                    id_pet: 3,
                    id_diagnosis: 10,
                    isActive: true,
                },
            },
        },
    })
    async updateMedicalRecord(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
    ): Promise<MedicalRecord> {
        return this.medicalrecordService.updateMedicalRecord(
            id,
            updateMedicalRecordDto,
        );
    }

    // -------- SOFT DELETE --------
    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a medical record by ID (isActive = false)' })
    @ApiParam({
        name: 'id',
        description: 'Medical record ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Medical record soft-deleted successfully',
    })
    @ApiNotFoundResponse({
        description: 'Medical record not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error deleting medical record',
    })
    async softDeleteMedicalRecord(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        await this.medicalrecordService.softDeleteMedicalRecord(id);
        return { message: `Medical record with ID ${id} soft-deleted successfully` };
    }
}
