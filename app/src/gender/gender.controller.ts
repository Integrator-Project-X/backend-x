import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { GenderService } from './gender.service';
import { GenderDto } from './dto/gender.dto';
import { UpdateGenderDTO } from './dto/update-gender.dto';
import { Roles } from 'src/auth/decorators/roles.deco';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('genders')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('genders')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  // ------------------ CREATE ------------------
  @Post()
  @ApiOperation({
    summary: 'Create a new gender',
    description: 'Registers a new gender in the database.',
  })
  @ApiBody({
    type: GenderDto,
    examples: {
      valid: {
        summary: 'Valid Example',
        value: {
          name: 'Male',
        },
      },
      invalid: {
        summary: 'Invalid Example (empty name)',
        value: {
          name: '',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Gender successfully created.',
    schema: {
      example: {
        id_gender: 1,
        name: 'Male',
        isActive: true,
        createdAt: '2025-11-11T10:00:00.000Z',
        updatedAt: '2025-11-11T10:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['Name must be a non-empty string'],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createGenderDto: GenderDto) {
    return this.genderService.createGender(createGenderDto);
  }

  // ------------------ GET ACTIVE ------------------
  @Get('active')
  @ApiOperation({
    summary: 'Retrieve all active genders',
    description: 'Returns the list of all genders with isActive = true.',
  })
  @ApiOkResponse({
    description: 'List of active genders',
    schema: {
      example: [
        { id_gender: 1, name: 'Male', isActive: true },
        { id_gender: 2, name: 'Female', isActive: true },
      ],
    },
  })
  async findAllActive() {
    return this.genderService.findAllActiveGenders();
  }

  // ------------------ GET ALL ------------------
  @Get()
  @ApiOperation({
    summary: 'Retrieve all genders',
    description:
      'Returns the list of all genders, including inactive ones if applicable.',
  })
  @ApiOkResponse({
    description: 'List of genders',
    schema: {
      example: [
        { id_gender: 1, name: 'Male', isActive: true },
        { id_gender: 2, name: 'Female', isActive: false },
      ],
    },
  })
  async findAllGenders() {
    return this.genderService.findAllGenders();
  }

  // ------------------ GET BY NAME ------------------
  @Get('name/:name')
  @ApiOperation({
    summary: 'Retrieve a gender by name',
    description: 'Searches a gender by its name. Case-insensitive.',
  })
  @ApiParam({ name: 'name', example: 'Male' })
  @ApiOkResponse({
    description: 'Gender found',
    schema: {
      example: {
        id_gender: 1,
        name: 'Male',
        isActive: true,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Gender not found by name',
    schema: {
      example: {
        statusCode: 404,
        message: 'No gender found with name "Unknown"',
        error: 'Not Found',
      },
    },
  })
  async getGenderByName(@Param('name') name: string) {
    return this.genderService.getGenderByName(name);
  }

  // ------------------ GET BY ID ------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve gender by ID',
    description: 'Finds a gender using its numeric ID.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Gender found',
    schema: {
      example: {
        id_gender: 1,
        name: 'Male',
        isActive: true,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Gender not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Gender with ID 99 not found.',
        error: 'Not Found',
      },
    },
  })
  async findGenderById(@Param('id', ParseIntPipe) id: number) {
    return this.genderService.findGenderById(id);
  }

  // ------------------ UPDATE ------------------
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a gender',
    description: 'Edits the name or status of an existing gender.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    type: UpdateGenderDTO,
    examples: {
      valid: {
        summary: 'Valid Example',
        value: {
          name: 'Non-Binary',
        },
      },
      invalid: {
        summary: 'Invalid Example (wrong format)',
        value: {
          name: 1234,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Gender updated successfully',
    schema: {
      example: {
        message: 'Gender with ID 1 updated successfully.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Gender not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Gender with ID 99 not found.',
        error: 'Not Found',
      },
    },
  })
  async updateGender(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenderDto: UpdateGenderDTO,
  ) {
    await this.genderService.updateGender(id, updateGenderDto);
    return { message: `Gender with ID ${id} updated successfully.` };
  }

  // ------------------ SOFT DELETE ------------------
  @Delete('soft/:id')
  @ApiOperation({
    summary: 'Soft delete gender',
    description:
      'Marks a gender as inactive without removing it from the database.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Gender soft deleted',
    schema: {
      example: {
        message: 'Gender with ID 1 soft deleted successfully.',
      },
    },
  })
  async softRemove(@Param('id', ParseIntPipe) id: number) {
    return this.genderService.deleteGenderById(id);
  }

  // ------------------ PERMANENT DELETE ------------------
  @Delete(':id')
  @ApiOperation({
    summary: 'Permanently delete gender',
    description:
      'Removes the gender record permanently from the database. This action cannot be undone.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Gender permanently deleted',
    schema: {
      example: {
        message: 'Gender with ID 1 deleted successfully.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Gender not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Gender with ID 99 not found.',
        error: 'Not Found',
      },
    },
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.genderService.deleteGenderById(id);
  }
}
