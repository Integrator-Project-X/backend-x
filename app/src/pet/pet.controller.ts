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
import { PetService } from './pet.service';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
    constructor(private readonly petService: PetService) { }

    /**
     * Create a new pet
     */
    @Post()
    @ApiOperation({ summary: 'Create a new pet' })
    @ApiBody({
        description: 'Pet data',
        type: PetDto,
        examples: {
            example1: {
                summary: 'Dog example',
                value: {
                    pet_name: 'Firulais',
                    birth_date: '2020-05-10T00:00:00.000Z',
                    isActive: true,
                    id_race: 1,
                    id_animal: 1,
                },
            },
            example2: {
                summary: 'Cat example',
                value: {
                    pet_name: 'Misu',
                    birth_date: '2022-01-15T00:00:00.000Z',
                    id_race: 3,
                    id_animal: 2,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Pet created successfully',
        schema: {
            example: {
                id_pet: 1,
                pet_name: 'Firulais',
                birth_date: '2020-05-10T00:00:00.000Z',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T17:01:22.303Z',
                race: {
                    id_race: 1,
                    race_name: 'Labrador',
                },
                animal: {
                    id_animal: 1,
                    animal_name: 'Dog',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - invalid data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to create pet',
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
            },
        },
    })
    async createPet(@Body() createPetDto: PetDto): Promise<Pet> {
        return await this.petService.createPet(createPetDto);
    }

    /**
     * Get all pets (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all pets' })
    @ApiResponse({
        status: 200,
        description: 'List of all pets',
        schema: {
            example: [
                {
                    id_pet: 1,
                    pet_name: 'Firulais',
                    birth_date: '2020-05-10T00:00:00.000Z',
                    isActive: true,
                    createdAt: '2025-11-27T17:01:22.303Z',
                    updatedAt: '2025-11-27T17:01:22.303Z',
                    race: {
                        id_race: 1,
                        race_name: 'Labrador',
                    },
                    animal: {
                        id_animal: 1,
                        animal_name: 'Dog',
                    },
                },
                {
                    id_pet: 2,
                    pet_name: 'Misu',
                    birth_date: '2022-01-15T00:00:00.000Z',
                    isActive: false,
                    createdAt: '2025-11-27T18:05:10.112Z',
                    updatedAt: '2025-11-27T18:10:10.112Z',
                    race: {
                        id_race: 3,
                        race_name: 'Persian',
                    },
                    animal: {
                        id_animal: 2,
                        animal_name: 'Cat',
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving pets',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving pets',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllPets(): Promise<Pet[]> {
        return await this.petService.findAllPets();
    }

    /**
     * Get all active pets (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active pets' })
    @ApiResponse({
        status: 200,
        description: 'List of all active pets',
        schema: {
            example: [
                {
                    id_pet: 1,
                    pet_name: 'Firulais',
                    birth_date: '2020-05-10T00:00:00.000Z',
                    isActive: true,
                    createdAt: '2025-11-27T17:01:22.303Z',
                    updatedAt: '2025-11-27T17:01:22.303Z',
                    race: {
                        id_race: 1,
                        race_name: 'Labrador',
                    },
                    animal: {
                        id_animal: 1,
                        animal_name: 'Dog',
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving active pets',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving active pets',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllActivePets(): Promise<Pet[]> {
        return await this.petService.findAllActivePets();
    }

    /**
     * Get a pet by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a pet by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Pet ID' })
    @ApiResponse({
        status: 200,
        description: 'Pet found',
        schema: {
            example: {
                id_pet: 1,
                pet_name: 'Firulais',
                birth_date: '2020-05-10T00:00:00.000Z',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T17:01:22.303Z',
                race: {
                    id_race: 1,
                    race_name: 'Labrador',
                },
                animal: {
                    id_animal: 1,
                    animal_name: 'Dog',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Pet not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Pet with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error finding pet',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding pet',
                error: 'Internal Server Error',
            },
        },
    })
    async findPetById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Pet> {
        return await this.petService.FindPetById(id);
    }

    /**
     * Update a pet by ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a pet by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Pet ID' })
    @ApiBody({
        type: PetDto,
        description: 'Updated pet data',
        examples: {
            updateExample: {
                summary: 'Update pet name and race',
                value: {
                    pet_name: 'Firulais Jr',
                    id_race: 2,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Pet updated successfully',
        schema: {
            example: {
                id_pet: 1,
                pet_name: 'Firulais Jr',
                birth_date: '2020-05-10T00:00:00.000Z',
                isActive: true,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T18:10:22.303Z',
                race: {
                    id_race: 2,
                    race_name: 'Golden Retriever',
                },
                animal: {
                    id_animal: 1,
                    animal_name: 'Dog',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Pet not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Pet with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating pet',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating pet',
                error: 'Internal Server Error',
            },
        },
    })
    async updatePet(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePetDto: PetDto,
    ): Promise<Pet> {
        return await this.petService.updatePet(id, updatePetDto);
    }

    /**
     * Deactivate (soft-delete) a pet by ID (set isActive = false)
     */
    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate (soft-delete) a pet by ID',
    })
    @ApiParam({ name: 'id', type: Number, description: 'Pet ID' })
    @ApiResponse({
        status: 200,
        description: 'Pet deactivated successfully',
        schema: {
            example: {
                id_pet: 1,
                pet_name: 'Firulais',
                birth_date: '2020-05-10T00:00:00.000Z',
                isActive: false,
                createdAt: '2025-11-27T17:01:22.303Z',
                updatedAt: '2025-11-27T18:20:22.303Z',
                race: {
                    id_race: 1,
                    race_name: 'Labrador',
                },
                animal: {
                    id_animal: 1,
                    animal_name: 'Dog',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Pet not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Pet with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error deleting pet',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting pet',
                error: 'Internal Server Error',
            },
        },
    })
    async softDeletePet(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Pet> {
        return await this.petService.softDeletePet(id);
    }
}
