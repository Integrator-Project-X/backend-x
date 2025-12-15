import { ApiProperty } from '@nestjs/swagger';

export class ApiMetaDto {
    @ApiProperty({ example: '2025-12-12T12:00:00.000Z' })
    timestamp!: string;

    @ApiProperty({ example: 'auth/register'})
    path!: string;
}

export class SuccessResponseDto {
    @ApiProperty({ example: true })
    success!: true;

    @ApiProperty({ description: 'Endpoint payload' })
    data!: unknown;

    @ApiProperty({ type: ApiMetaDto })
    meta!: ApiMetaDto;
}