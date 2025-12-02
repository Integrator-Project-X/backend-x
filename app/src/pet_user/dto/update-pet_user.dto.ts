import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { PetUserDto } from './pet_user.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdatePetUserDto extends PartialType(PetUserDto) {
    @ApiPropertyOptional({
        type: 'string',
        nullable: true,
        example: null,
        description: 'Solo null se permite aquí, para reactivar vía endpoint especial.',
    })
    @IsOptional()
    @IsIn([null], {
        message:
            'deleted_at debe ser null. Usa el endpoint de soft-delete para desactivar.',
    })
    deleted_at?: null;
}