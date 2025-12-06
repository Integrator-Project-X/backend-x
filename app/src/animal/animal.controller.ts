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
import { AnimalService } from './animal.service';
import { Animal } from './entities/animal.entity';
import { AnimalDto } from './dto/animal.dto';

@ApiTags('Animals')
@Controller('animals')
export class AnimalController {
    constructor(private readonly animalService: AnimalService) { }

    /**
     * Create a new animal
     */
    @Post()
    @ApiOperation({ summary: 'Create a new animal' })
    @ApiBody({
        description: 'Animal data to create',
        type: AnimalDto,
        examples: {
            example1: {
                summary: 'Dog example',
                value: {
                    animal_name: 'Dog',
                },
            },
            example2: {
                summary: 'Cat example',
                value: {
                    animal_name: 'Cat',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Animal created successfully',
        schema: {
            example: {
                id_animal: 1,
                animal_name: 'Dog',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Failed to create animal',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to create animal',
            },
        },
    })
    async createAnimal(@Body() createAnimalDto: AnimalDto): Promise<Animal> {
        return await this.animalService.createAnimal(createAnimalDto);
    }

    /**
     * Get all animals
     */
    @Get()
    @ApiOperation({ summary: 'Get all animals' })
    @ApiResponse({
        status: 200,
        description: 'List of all animals',
        schema: {
            example: [
                {
                    id_animal: 1,
                    animal_name: 'Dog',
                    isActive: true,
                    createdAt: '2025-11-27T18:00:00.000Z',
                    updatedAt: '2025-11-27T18:00:00.000Z',
                },
                {
                    id_animal: 2,
                    animal_name: 'Cat',
                    age: 2,
                    isActive: false,
                    createdAt: '2025-11-26T10:15:20.100Z',
                    updatedAt: '2025-11-26T10:15:20.100Z',
                },
            ],
        },
    })
    async findAllAnimals(): Promise<Animal[]> {
        return await this.animalService.findAllAnimals();
    }

    /**
     * Get all active animals
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active animals' })
    @ApiResponse({
        status: 200,
        description: 'List of active animals',
        schema: {
            example: [
                {
                    id_animal: 1,
                    animal_name: 'Dog',
                    isActive: true,
                    createdAt: '2025-11-27T18:00:00.000Z',
                    updatedAt: '2025-11-27T18:00:00.000Z',
                },
            ],
        },
    })
    async findAllActiveAnimals(): Promise<Animal[]> {
        return await this.animalService.findAllActiveAnimals();
    }

    /**
     * Get an animal by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get an animal by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Animal ID' })
    @ApiResponse({
        status: 200,
        description: 'Animal found',
        schema: {
            example: {
                id_animal: 1,
                animal_name: 'Dog',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Animal not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Animal with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error finding animal',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding animal',
            },
        },
    })
    async findAnimalById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Animal> {
        return await this.animalService.FindAnimalByid(id);
    }

    /**
     * Update an animal by ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update an animal by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Animal ID' })
    @ApiBody({
        type: AnimalDto,
        description: 'Updated animal data',
        examples: {
            updateExample: {
                summary: 'Update animal info',
                value: {
                    animal_name: 'Rabbit',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Animal updated successfully',
        schema: {
            example: {
                id_animal: 1,
                animal_name: 'Rabbit',
                isActive: true,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T19:10:50.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Animal not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Animal with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating animal',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating animal',
            },
        },
    })
    async updateAnimal(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnimalDto: AnimalDto,
    ): Promise<Animal> {
        return await this.animalService.updateAnimal(id, updateAnimalDto);
    }

    /**
     * Deactivate (soft-delete) an animal by ID
     */
    @Patch(':id/desactivate')
    @ApiOperation({ summary: 'Desactivate (soft-delete) an animal by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Animal ID' })
    @ApiResponse({
        status: 200,
        description: 'Animal deactivated successfully',
        schema: {
            example: {
                id_animal: 1,
                animal_name: 'Dog',
                isActive: false,
                createdAt: '2025-11-27T18:00:00.000Z',
                updatedAt: '2025-11-27T18:20:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Animal not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Animal with ID "99" not found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error deleting animal',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting animal',
            },
        },
    })
    async softDeleteAnimal(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Animal> {
        return await this.animalService.softDeleteAnimal(id);
    }
}
