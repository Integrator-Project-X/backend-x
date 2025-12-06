import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { PetService } from './pet.service';
import { Pet } from './entities/pet.entity';
import { PetDto } from './dto/pet.dto';
import { UpdatePetDto } from './dto/update-pet';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
    constructor(private readonly petService: PetService) { }

    // ---------------------------------------------------------
    // CREATE PET (supports image upload)
    // ---------------------------------------------------------
    @Post()
    @ApiOperation({ summary: 'Create a new pet (supports image upload)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description:
            'Pet data. Supports an optional image file in the `image` field.',
        type: PetDto,
        examples: {
            example1: {
                summary: 'Dog with image',
                value: {
                    pet_name: 'Firulais',
                    birth_date: '2020-05-10T00:00:00.000Z',
                    isActive: true,
                    id_race: 1,
                    id_animal: 1,
                    // Send image as file, not in JSON
                },
            },
            example2: {
                summary: 'Cat without image',
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
                image_url:
                    'https://project.supabase.co/storage/v1/object/public/pets/firulais-123.jpg',
                createdAt: '2025-12-06T05:20:00.000Z',
                updatedAt: '2025-12-06T05:20:00.000Z',
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
        description: 'Bad Request - invalid data or image upload failed',
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
    @UseInterceptors(FileInterceptor('image'))
    async createPet(
        @Body() createPetDto: PetDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Pet> {
        return await this.petService.createPet(createPetDto, file);
    }

    // ---------------------------------------------------------
    // GET ALL PETS
    // ---------------------------------------------------------
    @Get()
    @ApiOperation({ summary: 'Get all pets (active and inactive)' })
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
                    image_url:
                        'https://project.supabase.co/storage/v1/object/public/pets/firulais.jpg',
                    createdAt: '2025-12-06T05:20:00.000Z',
                    updatedAt: '2025-12-06T05:20:00.000Z',
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
                    image_url: null,
                    createdAt: '2025-12-06T06:00:00.000Z',
                    updatedAt: '2025-12-06T06:10:00.000Z',
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

    // ---------------------------------------------------------
    // GET ACTIVE PETS
    // ---------------------------------------------------------
    @Get('active')
    @ApiOperation({ summary: 'Get all active pets (isActive = true)' })
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
                    image_url:
                        'https://project.supabase.co/storage/v1/object/public/pets/firulais.jpg',
                    createdAt: '2025-12-06T05:20:00.000Z',
                    updatedAt: '2025-12-06T05:20:00.000Z',
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

    // ---------------------------------------------------------
    // GET PET BY ID
    // ---------------------------------------------------------
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
                image_url:
                    'https://project.supabase.co/storage/v1/object/public/pets/firulais.jpg',
                createdAt: '2025-12-06T05:20:00.000Z',
                updatedAt: '2025-12-06T05:20:00.000Z',
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
    async findPetById(@Param('id', ParseIntPipe) id: number): Promise<Pet> {
        return await this.petService.FindPetById(id);
    }

    // ---------------------------------------------------------
    // UPDATE PET (supports image upload)
    // ---------------------------------------------------------
    @Patch(':id')
    @ApiOperation({ summary: 'Update a pet (supports image upload)' })
    @ApiParam({ name: 'id', type: Number, description: 'Pet ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UpdatePetDto,
        description:
            'Fields to update. All fields are optional. Supports updating the image via the `image` file field.',
        examples: {
            example1: {
                summary: 'Update name and race',
                value: {
                    pet_name: 'Firulais Jr',
                    id_race: 2,
                },
            },
            example2: {
                summary: 'Only update image',
                value: {
                    // campos en JSON vacíos; la imagen va como archivo
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
                image_url:
                    'https://project.supabase.co/storage/v1/object/public/pets/firulais-new.jpg',
                createdAt: '2025-12-06T05:20:00.000Z',
                updatedAt: '2025-12-06T06:30:00.000Z',
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
        status: 400,
        description: 'Bad Request - invalid data or image upload failed',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to update pet',
                error: 'Bad Request',
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
    @UseInterceptors(FileInterceptor('image'))
    async updatePet(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePetDto: UpdatePetDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Pet> {
        return await this.petService.updatePet(id, updatePetDto, file);
    }

    // ---------------------------------------------------------
    // SOFT DELETE PET
    // ---------------------------------------------------------
    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Deactivate (soft delete) a pet' })
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
                image_url:
                    'https://project.supabase.co/storage/v1/object/public/pets/firulais.jpg',
                createdAt: '2025-12-06T05:20:00.000Z',
                updatedAt: '2025-12-06T07:00:00.000Z',
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
    async softDeletePet(@Param('id', ParseIntPipe) id: number): Promise<Pet> {
        return await this.petService.softDeletePet(id);
    }
}
