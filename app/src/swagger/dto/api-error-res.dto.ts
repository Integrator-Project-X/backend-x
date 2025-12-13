import { ApiProperty } from '@nestjs/swagger';

class ApiErrorBodyDto {
    @ApiProperty({ example: 'Unauthorized' })
    message!: string;

    @ApiProperty({ required: false, example: ['email must be an email'] })
    details?: string[];

    @ApiProperty({ required: false, example: '23505' })
    code?: string;

    @ApiProperty({ required: false, example: 'Key (email)=(a@b.com) already exists.' })
    detail?: string;
}

export class ApiErrorResponseDto {
    @ApiProperty({ example: false })
    success!: false;

    @ApiProperty({ example: 400 })
    statusCode!: number;

    @ApiProperty({ type: ApiErrorBodyDto })
    error!: ApiErrorBodyDto;

    @ApiProperty({ example: '/auth/register' })
    path!: string;

    @ApiProperty({ example: 'POST' })
    method!: string;

    @ApiProperty({ example: '2025-12-12T12:00:00.000Z' })
    timestamp!: string;
}