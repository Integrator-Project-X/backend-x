import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { JobpositionService } from './jobposition.service';
import { JobPosition } from './entities/jobposition.entity';
import { JobPositionDto } from './dto/jobposition.dto';

@ApiTags('Job Positions')
@Controller('jobpositions')
export class JobpositionController {
    constructor(private readonly jobpositionService: JobpositionService) { }

    /**
     * Create a new job position
     */
    @Post()
    @ApiOperation({ summary: 'Create a new job position' })
    @ApiBody({
        description: 'Job position data',
        type: JobPositionDto,
        examples: {
            example1: {
                summary: 'Receptionist position',
                value: { job_position_name: 'Receptionist' },
            },
            example2: {
                summary: 'Surgery Assistant',
                value: { job_position_name: 'Surgery Assistant' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Job position created successfully',
        schema: {
            example: {
                id_job_position: 1,
                job_position_name: 'Receptionist',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T17:01:22.303Z',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to create job position',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to create job position',
            },
        },
    })
    async createJobPosition(
        @Body() createJobpositionDto: JobPositionDto,
    ): Promise<JobPosition> {
        return await this.jobpositionService.createJobPosition(createJobpositionDto);
    }

    /**
     * Get all job positions (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all job positions' })
    @ApiResponse({
        status: 200,
        description: 'List of all job positions',
        schema: {
            example: [
                {
                    id_job_position: 1,
                    job_position_name: 'Receptionist',
                    isActive: true,
                    createdAt: '2025-11-27T17:01:22.303Z',
                    updatedAt: '2025-11-27T17:01:22.303Z',
                },
                {
                    id_job_position: 2,
                    job_position_name: 'Veterinary Assistant',
                    isActive: false,
                    createdAt: '2025-11-27T17:05:10.112Z',
                    updatedAt: '2025-11-27T17:05:10.112Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving job positions',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving job positions',
            },
        },
    })
    async findAllJobPositions(): Promise<JobPosition[]> {
        return await this.jobpositionService.findAllJobPositions();
    }

    /**
     * Get all active job positions (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active job positions' })
    @ApiResponse({
        status: 200,
        description: 'List of all active job positions',
        schema: {
            example: [
                {
                    id_job_position: 1,
                    job_position_name: 'Receptionist',
                    isActive: true,
                    createdAt: '2025-11-27T17:01:22.303Z',
                    updatedAt: '2025-11-27T17:01:22.303Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving active job positions',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving active job positions',
            },
        },
    })
    async findAllActiveJobPositions(): Promise<JobPosition[]> {
        return await this.jobpositionService.findAllActiveJobPositions();
    }

    /**
     * Get a job position by its ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a job position by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Job position ID' })
    @ApiResponse({
        status: 200,
        description: 'Job position found',
        schema: {
            example: {
                id_job_position: 1,
                job_position_name: 'Receptionist',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T17:01:22.303Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Job position not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Job position with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error finding job position',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding job position',
            },
        },
    })
    async findJobPositionById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<JobPosition> {
        return await this.jobpositionService.findJobPositionById(id);
    }

    /**
     * Update a job position by its ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a job position by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Job position ID' })
    @ApiBody({
        type: JobPositionDto,
        description: 'Updated job position data',
        examples: {
            updateExample: {
                summary: 'Updated name',
                value: { job_position_name: 'Senior Veterinary Assistant' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Job position updated successfully',
        schema: {
            example: {
                id_job_position: 1,
                job_position_name: 'Senior Veterinary Assistant',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T18:01:22.303Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Job position not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Job position with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating job position',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating job position',
            },
        },
    })
    async updateJobPosition(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateJobpositionDto: JobPositionDto,
    ): Promise<JobPosition> {
        return await this.jobpositionService.updateJobPosition(
            id,
            updateJobpositionDto,
        );
    }

    /**
     * Deactivate (soft-delete) a job position by its ID
     */
    @Patch(':id/desactivate')
    @ApiOperation({ summary: 'Desactivate (soft-delete) a job position by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Job position ID' })
    @ApiResponse({
        status: 200,
        description: 'Job position deactivated successfully',
        schema: {
            example: {
                message: 'Job position with ID "1" deactivated successfully',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Job position not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Job position with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error deleting job position',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting job position',
            },
        },
    })
    async softDeleteJobPosition(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return await this.jobpositionService.softDeleteJobPosition(id);
    }
}
