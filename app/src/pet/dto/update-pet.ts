// pets/dto/update-pet.dto.ts
import { PartialType } from '@nestjs/swagger';
import { PetDto } from './pet.dto';

export class UpdatePetDto extends PartialType(PetDto) {}
// Note: We don't need to repeat the properties again.