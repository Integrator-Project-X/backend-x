import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentstypeDto {
    @ApiProperty({
        example: 'Consulta de control',
        description: 'Nombre actualizado del tipo de cita',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: true,
        description: 'Indica si el tipo de cita está activo o no',
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
