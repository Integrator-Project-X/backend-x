import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { AppointmentstypesService } from './appointmentstypes.service';
import { CreateAppointmentstypeDto } from './dto/create-appointmentstype.dto';
import { UpdateAppointmentstypeDto } from './dto/update-appointmentstype.dto';
import { AppointmentsTypes } from './entities/appointments_types.entity';
import { Roles } from 'src/auth/decorators/roles.deco';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('appointments-types')
@Controller('appointments-types')
export class AppointmentstypesController {
    constructor(
        private readonly appointmentstypesService: AppointmentstypesService,
    ) { }

    // -----------------------------------------------------------
    // CREATE
    // -----------------------------------------------------------
    @Post()
    @ApiOperation({
        summary: 'Crear tipo de cita',
        description:
            'Crea un nuevo tipo de cita (por ejemplo: consulta general, urgencias, vacunación, etc.).',
    })
    @ApiCreatedResponse({
        description: 'Tipo de cita creado correctamente.',
        type: AppointmentsTypes,
    })
    @ApiBadRequestResponse({
        description: 'Datos inválidos o error al crear el tipo de cita.',
    })
    async createAppointmentstype(
        @Body() dto: CreateAppointmentstypeDto,
    ): Promise<AppointmentsTypes> {
        return this.appointmentstypesService.createAppointmentstypes(dto.name);
    }

    // -----------------------------------------------------------
    // GET ALL
    // -----------------------------------------------------------
    @Get()
    @ApiOperation({
        summary: 'Listar todos los tipos de cita',
        description: 'Obtiene el listado completo de tipos de cita registrados.',
    })
    @ApiOkResponse({
        description: 'Listado de tipos de cita obtenido correctamente.',
        type: [AppointmentsTypes],
    })
    @ApiInternalServerErrorResponse({
        description: 'Error al obtener los tipos de cita.',
    })
    async getAllAppointmentstypes(): Promise<AppointmentsTypes[]> {
        return this.appointmentstypesService.getAllAppointmentstypes();
    }

    // -----------------------------------------------------------
    // GET BY ID
    // -----------------------------------------------------------
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un tipo de cita por ID',
        description: 'Devuelve un tipo de cita específico según su ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del tipo de cita',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Tipo de cita encontrado.',
        type: AppointmentsTypes,
    })
    @ApiNotFoundResponse({
        description: 'No se encontró un tipo de cita con ese ID.',
    })
    async getAppointmentstypeById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<AppointmentsTypes> {
        return this.appointmentstypesService.getAppointmentstypesById(id);
    }

    // -----------------------------------------------------------
    // GET ACTIVE
    // -----------------------------------------------------------
    @Get('status/active')
    @ApiOperation({
        summary: 'Listar tipos de cita activos',
        description: 'Obtiene todos los tipos de cita que están marcados como activos.',
    })
    @ApiOkResponse({
        description: 'Listado de tipos de cita activos obtenido correctamente.',
        type: [AppointmentsTypes],
    })
    @ApiInternalServerErrorResponse({
        description: 'Error al obtener los tipos de cita activos.',
    })
    async getActiveAppointmentstypes(): Promise<AppointmentsTypes[]> {
        return this.appointmentstypesService.getActiveAppointmentstypes();
    }

    // -----------------------------------------------------------
    // UPDATE
    // -----------------------------------------------------------
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un tipo de cita',
        description:
            'Actualiza el nombre y/o estado (activo/inactivo) de un tipo de cita existente.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del tipo de cita a actualizar',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Tipo de cita actualizado correctamente.',
        type: AppointmentsTypes,
    })
    @ApiBadRequestResponse({
        description: 'Datos inválidos o error al actualizar el tipo de cita.',
    })
    @ApiNotFoundResponse({
        description: 'No se encontró un tipo de cita con ese ID.',
    })
    async updateAppointmentstype(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAppointmentstypeDto,
    ): Promise<AppointmentsTypes> {
        return this.appointmentstypesService.updateAppointmentstypes(
            id,
            dto.name,
            dto.isActive,
        );
    }

    // -----------------------------------------------------------
    // DELETE
    // -----------------------------------------------------------
    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un tipo de cita',
        description:
            'Elimina definitivamente un tipo de cita. (Si quieres soft delete, mejor cambiar la implementación en el servicio).',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del tipo de cita a eliminar',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Tipo de cita eliminado correctamente.',
    })
    @ApiNotFoundResponse({
        description: 'No se encontró un tipo de cita con ese ID.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Error al eliminar el tipo de cita.',
    })
    async deleteAppointmentstype(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        await this.appointmentstypesService.deleteAppointmentstypes(id);
        return { message: `Appointment type with ID ${id} deleted successfully` };
    }
}
