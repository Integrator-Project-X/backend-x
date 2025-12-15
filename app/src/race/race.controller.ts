import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { RaceService } from './race.service';
import { Race } from './entities/race.entity';
import { RaceDto } from './dto/race.dto';
import { Roles } from 'src/auth/decorators/roles.deco';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Races')
@Controller('races')
export class RaceController {
    constructor(private readonly raceService: RaceService) { }

    /**
     * Create a new race
     */
    @Post()
    @ApiOperation({ summary: 'Create a new race (pet breed)' })
    @ApiBody({
        description: 'Race data to create',
        type: RaceDto,
        examples: {
            example1: {
                summary: 'German Shepherd',
                value: { race_name: 'German Shepherd' },
            },
            example2: {
                summary: 'Golden Retriever',
                value: { race_name: 'Golden Retriever' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Race created successfully',
        schema: {
            example: {
                id_race: 1,
                race_name: 'German Shepherd',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation or creation error',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to create race',
            },
        },
    })
    async createRace(@Body() createRaceDto: RaceDto): Promise<Race> {
        return await this.raceService.createRace(createRaceDto);
    }

    /**
     * Get all races
     */
    @Get()
    @ApiOperation({ summary: 'Get all races' })
    @ApiResponse({
        status: 200,
        description: 'List of all races',
        schema: {
            example: [
                {
                    id_race: 1,
                    race_name: 'German Shepherd',
                    isActive: true,
                    createdAt: '2025-11-27T18:00:00.000Z',
                    updatedAt: '2025-11-27T18:00:00.000Z',
                },
                {
                    id_race: 2,
                    race_name: 'Bulldog',
                    isActive: false,
                    createdAt: '2025-11-26T10:15:20.100Z',
                    updatedAt: '2025-11-26T10:15:20.100Z',
                },
            ],
        },
    })
    async findAllRaces(): Promise<Race[]> {
        return await this.raceService.findAllRaces();
    }

    /**
     * Get all active races
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active races' })
    @ApiResponse({
        status: 200,
        description: 'List of active races',
        schema: {
            example: [
                {
                    id_race: 1,
                    race_name: 'German Shepherd',
                    isActive: true,
                    createdAt: '2025-11-27T18:00:00.000Z',
                    updatedAt: '2025-11-27T18:00:00.000Z',
                },
            ],
        },
    })
    async findAllActiveRaces(): Promise<Race[]> {
        return await this.raceService.findAllActiveRaces();
    }

    /**
     * Get race by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a race by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Race ID' })
    @ApiResponse({
        status: 200,
        description: 'Race found',
        schema: {
            example: {
                id_race: 1,
                race_name: 'German Shepherd',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Race not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Race with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Server error finding race',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding race',
            },
        },
    })
    async findRaceById(@Param('id', ParseIntPipe) id: number): Promise<Race> {
        return await this.raceService.FindRaceById(id);
    }

    /**
     * Update race
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a race by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Race ID' })
    @ApiBody({
        type: RaceDto,
        description: 'Updated race data',
        examples: {
            updateExample: {
                summary: 'Update race name',
                value: { race_name: 'Updated Breed Name' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Race updated successfully',
        schema: {
            example: {
                id_race: 1,
                race_name: 'Updated Breed Name',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T19:10:50.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Race not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Race with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Server error updating race',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating race',
            },
        },
    })
    async updateRace(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRaceDto: RaceDto,
    ): Promise<Race> {
        return await this.raceService.updateRace(id, updateRaceDto);
    }

    /**
     * Soft delete race
     */
    @Patch(':id/desactivate')
    @ApiOperation({ summary: 'Desactivate (soft-delete) a race by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Race ID' })
    @ApiResponse({
        status: 200,
        description: 'Race deactivated successfully',
        schema: {
            example: {
                id_race: 1,
                race_name: 'German Shepherd',
                isActive: false,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:20:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Race not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Race with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Server error deleting race',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting race',
            },
        },
    })
    async softDeleteRace(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Race> {
        return await this.raceService.softDeleteRace(id);
    }
}
