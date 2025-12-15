// pets/dto/create-pet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class PetDto {
  @ApiProperty({
    example: 'Firulais',
    description: 'Name of the pet',
  })
  @IsString()
  @IsNotEmpty()
  pet_name: string;

  @ApiProperty({
    example: '2020-05-10T00:00:00.000Z',
    description: 'Birth date of the pet in ISO format',
  })
  @IsDateString()
  birth_date: Date;

  @ApiProperty({
    example: true,
    description: 'Whether the pet is active',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    example: 1,
    description: 'Race ID (foreign key to races table)',
  })
  @IsInt()
  @Min(1)
  id_race: number;

  @ApiProperty({
    example: 2,
    description: 'Animal ID (foreign key to animals table)',
  })
  @IsInt()
  @Min(1)
  id_animal: number;

  // Image file support
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Image file of the pet (optional)',
  })
  @IsOptional()
  image?: any;
}
