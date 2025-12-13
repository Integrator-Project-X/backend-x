import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
    @ApiProperty({ example: 10 })
    userId!: number;

    @ApiProperty({ example: 22 })
    accessId!: number;

    @ApiProperty({ example: 1 })
    roleId!: number;

    @ApiProperty({ example: 'admin' })
    roleName!: string;

    @ApiProperty({ example: 'admin@vetconnect.com' })
    email!: string;
}