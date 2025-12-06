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

    // Swagger: this endpoint consumes multipart/form-data
    @ApiConsumes('multipart/form-data')

    // Swagger body: use the DTO (includes image as binary)
    @ApiBody({ type: PetDto })

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
    @ApiOperation({ summary: 'Get all pets' })
    async findAllPets(): Promise<Pet[]> {
        return await this.petService.findAllPets();
    }

    // ---------------------------------------------------------
    // GET ACTIVE PETS
    // ---------------------------------------------------------
    @Get('active')
    @ApiOperation({ summary: 'Get all active pets' })
    async findAllActivePets(): Promise<Pet[]> {
        return await this.petService.findAllActivePets();
    }

    // ---------------------------------------------------------
    // GET PET BY ID
    // ---------------------------------------------------------
    @Get(':id')
    @ApiOperation({ summary: 'Get a pet by ID' })
    async findPetById(@Param('id', ParseIntPipe) id: number): Promise<Pet> {
        return await this.petService.FindPetById(id);
    }

    // ---------------------------------------------------------
    // UPDATE PET (supports image upload)
    // ---------------------------------------------------------
    @Patch(':id')
    @ApiOperation({ summary: 'Update a pet (supports image upload)' })

    @ApiConsumes('multipart/form-data')

    @ApiBody({ type: UpdatePetDto })

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
    async softDeletePet(@Param('id', ParseIntPipe) id: number): Promise<Pet> {
        return await this.petService.softDeletePet(id);
    }
}
