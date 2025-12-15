import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Gender } from 'src/gender/entities/gender.entity';
import { Access } from 'src/access/entities/access.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Gender, Access])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }