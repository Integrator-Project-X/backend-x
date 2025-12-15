import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, IsBoolean } from 'class-validator';

export class AppointmentDto {
    @ApiProperty({ example: 1, description: 'ID de la mascota (FK a pets)' })
    @IsInt()
    @Min(1)
    id_pet: number;

    @ApiProperty({ example: 1, description: 'ID del usuario (dueño / responsable)' })
    @IsInt()
    @Min(1)
    id_user: number;

    @ApiProperty({ example: 1, description: 'ID de la clínica' })
    @IsInt()
    @Min(1)
    id_clinic: number;

    @ApiProperty({ example: 1, description: 'ID del tipo de cita' })
    @IsInt()
    @Min(1)
    id_type: number;

    @ApiProperty({ example: 1, description: 'ID del estado de la cita' })
    @IsInt()
    @Min(1)
    id_status: number;

    @ApiProperty({
        example: 3,
        description: 'ID del diagnóstico (opcional, se puede asignar después)',
        required: false,
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    id_diagnosis?: number;

    @ApiProperty({
        example: 'Consulta de control general',
        description: 'Descripción / motivo de la cita',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: true,
        description: 'Si la cita está activa (soft delete)',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}