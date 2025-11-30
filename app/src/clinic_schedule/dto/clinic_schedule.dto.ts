import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    Matches,
    IsBoolean,
    IsOptional,
    IsInt,
    Min,
} from 'class-validator';

export class ClinicScheduleDto {
    @ApiProperty({
        example: 1,
        description: 'Clinic ID (foreign key to clinic table)',
    })
    @IsInt()
    @Min(1)
    id_clinic: number;

    @ApiProperty({
        example: 'Monday',
        description: 'Day of the week',
    })
    @IsString()
    @IsNotEmpty()
    day_of_week: string;

    @ApiProperty({
        example: '08:00:00',
        description: 'Opening time in HH:mm:ss format',
    })
    @IsString()
    @Matches(/^\d{2}:\d{2}:\d{2}$/, {
        message: 'open_time must be in HH:mm:ss format',
    })
    open_time: string;

    @ApiProperty({
        example: '18:00:00',
        description: 'Closing time in HH:mm:ss format',
    })
    @IsString()
    @Matches(/^\d{2}:\d{2}:\d{2}$/, {
        message: 'close_time must be in HH:mm:ss format',
    })
    close_time: string;

    @ApiProperty({
        example: true,
        description: 'Whether the schedule is active',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
