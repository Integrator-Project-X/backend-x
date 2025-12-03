import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';

import { DiagnosisService } from './diagnosis.service';
import { DiagnosisDto } from './dto/diagnosis.dto';
import { Diagnosis } from './entities/diagnosis.entity';

@ApiTags('Diagnosis') 
@Controller('diagnosis')
export class DiagnosisController {
    constructor(private readonly diagnosisService: DiagnosisService) { }

    // ------------------ CREATE ------------------
    @Post()
    @ApiOperation({ summary: 'Create a new diagnosis' })
    @ApiCreatedResponse({
        description: 'Diagnosis created successfully',
        type: Diagnosis,
    })
    @ApiBadRequestResponse({
        description: 'Failed to create diagnosis',
    })
    @ApiBody({
        description: 'Diagnosis payload',
        type: DiagnosisDto,
        examples: {
            example1: {
                summary: 'Basic diagnosis example',
                value: {
                    id_personal: 1,
                    diagnosisName: 'Hypertension',
                    description: 'High blood pressure controlled with medication.',
                    isActive: true,
                },
            },
        },
    })
    async createDiagnosis(@Body() createDiagnosisDto: DiagnosisDto) {
        return this.diagnosisService.createDiagnosis(createDiagnosisDto);
    }

    // ------------------ FIND ALL ------------------
    @Get()
    @ApiOperation({ summary: 'Get all diagnoses' })
    @ApiOkResponse({
        description: 'List of all diagnoses',
        type: Diagnosis,
        isArray: true,
    })
    async findAllDiagnoses() {
        return this.diagnosisService.findAllDiagnoses();
    }

    // ------------------ FIND ALL ACTIVE ------------------
    @Get('active')
    @ApiOperation({ summary: 'Get all active diagnoses' })
    @ApiOkResponse({
        description: 'List of all active diagnoses',
        type: Diagnosis,
        isArray: true,
    })
    async findAllActiveDiagnoses() {
        return this.diagnosisService.findAllActiveDiagnoses();
    }

    // ------------------ FIND BY ID ------------------
    @Get(':id')
    @ApiOperation({ summary: 'Get a diagnosis by ID' })
    @ApiParam({
        name: 'id',
        description: 'Diagnosis ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Diagnosis found',
        type: Diagnosis,
    })
    @ApiNotFoundResponse({
        description: 'Diagnosis not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error finding diagnosis',
    })
    async findDiagnosisById(@Param('id', ParseIntPipe) id: number) {
        return this.diagnosisService.FindDiagnosisById(id);
    }

    // ------------------ UPDATE ------------------
    @Patch(':id')
    @ApiOperation({ summary: 'Update a diagnosis by ID' })
    @ApiParam({
        name: 'id',
        description: 'Diagnosis ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Diagnosis updated successfully',
        type: Diagnosis,
    })
    @ApiNotFoundResponse({
        description: 'Diagnosis not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error updating diagnosis',
    })
    @ApiBody({
        description: 'Diagnosis data to update',
        type: DiagnosisDto,
        examples: {
            example1: {
                summary: 'Update description & status',
                value: {
                    id_personal: 1,
                    diagnosisName: 'Hypertension (Controlled)',
                    description: 'Patient with controlled blood pressure. New treatment.',
                    isActive: true,
                },
            },
        },
    })
    async updateDiagnosis(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDiagnosisDto: DiagnosisDto,
    ) {
        return this.diagnosisService.updateDiagnosis(id, updateDiagnosisDto);
    }

    // ------------------ SOFT DELETE ------------------
    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a diagnosis by ID' })
    @ApiParam({
        name: 'id',
        description: 'Diagnosis ID',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Diagnosis soft-deleted (isActive = false)',
        type: Diagnosis,
    })
    @ApiNotFoundResponse({
        description: 'Diagnosis not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error deleting diagnosis',
    })
    async softDeleteDiagnosis(@Param('id', ParseIntPipe) id: number) {
        return this.diagnosisService.softDeleteDiagnosis(id);
    }
}
