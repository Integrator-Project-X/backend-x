import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentstypeDto {
  @ApiProperty({
    example: 'Consulta general',
    description: 'Nombre del tipo de cita',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
