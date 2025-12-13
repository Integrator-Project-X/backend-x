import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './interfaces/auth-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { Access } from 'src/access/entities/access.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Gender } from 'src/gender/entities/gender.entity';

@Injectable()
export class AuthService {
    private static readonly DUMMY_BCRYPT_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8PCXqZg5e8z5Pj7O7pS8fJYpQvB2G6';
    private static readonly DEFAULT_ROLE = 'CLIENT';
    constructor(
        @InjectRepository(Access)
        private readonly accessRepo: Repository<Access>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(Gender)
        private readonly genderRepo: Repository<Gender>,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) { }
    private async findActiveAccessByEmail(email: string): Promise<Access | null> {
        return this.accessRepo
            .createQueryBuilder('access')
            .select(['access.id_access', 'access.email', 'access.password', 'access.isActive'])
            .leftJoin('access.user', 'user')
            .addSelect(['user.id_user'])
            .leftJoin('access.role', 'role')
            .addSelect(['role.id_role', 'role.role_name'])
            .where('LOWER(access.email) = LOWER(:email)', { email })
            .andWhere('access.isActive = true')
            .getOne();
    }
    async validateCredentials(emailRaw: string, passwordRaw: string): Promise<AuthUser> {
        const email = emailRaw.trim(),
            password = passwordRaw;

        const access = await this.findActiveAccessByEmail(email);

        const hashToCompare = access?.password ?? AuthService.DUMMY_BCRYPT_HASH,
            passwordOk = await bcrypt.compare(password, hashToCompare);
        if (!access || !passwordOk) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessId = access.id_access,
            userId = access.user?.id_user,
            roleId = access.role?.id_role,
            roleName = access.role?.role_name;
        if (!accessId || !userId || !roleId || !roleName) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            userId,
            accessId,
            roleId,
            roleName,
            email: access.email,
        };
    }
    async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
        const user = await this.validateCredentials(dto.email, dto.password);
        const payload: JwtPayload = {
            userId: user.userId,
            accessId: user.accessId,
            roleId: user.roleId,
            roleName: user.roleName,
            email: user.email,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken, user };
    }
    
    async register(dto: RegisterDto): Promise<{ user: AuthUser }> {
        const email = dto.email.trim().toLocaleLowerCase();
        
        return this.userRepo.manager.transaction(async (manager) => {
            const emailExists = await manager
                .getRepository(Access)
                .createQueryBuilder('access')
                .select(['access.id_access'])
                .where('LOWER(access.email) = LOWER(:email)', { email })
                .getOne();
            if (emailExists) {
                throw new BadRequestException('Email is already in use');
            }
            const idExists = await manager.getRepository(User).findOne({
                where: { identification_number: dto.identification_number },
            });
            if (idExists) {
                throw new BadRequestException('A user with this identification already exists');
            }
            const gender = await manager.getRepository(Gender).findOne({
                where: { id_gender: dto.id_gender },
            });
            if (!gender) {
                throw new BadRequestException(`Gender with id ${dto.id_gender} does not exist`);
            }
            const role = await manager.getRepository(Role).findOne({
                where: { role_name: AuthService.DEFAULT_ROLE as any },
            });
            if (!role) {
                throw new InternalServerErrorException(
                    `Default role "${AuthService.DEFAULT_ROLE}" is not configured`,
                );
            }
            const newUser = manager.getRepository(User).create({
                full_name: dto.full_name,
                age: dto.age,
                address: dto.address,
                phone_number: dto.phone_number,
                identification_number: dto.identification_number,
                gender,
                isActive: true,
            });
            const savedUser = await manager.getRepository(User).save(newUser),
                salt = await bcrypt.genSalt(10),
                passwordHash = await bcrypt.hash(dto.password, salt);
            
            const access = manager.getRepository(Access).create({
                email,
                password: passwordHash,
                isActive: true,
                user: savedUser,
                role,
            });
            const savedAccess = await manager.getRepository(Access).save(access);

            const authUser: AuthUser = {
                userId: savedUser.id_user,
                accessId: savedAccess.id_access,
                roleId: role.id_role,
                roleName: role.role_name,
                email: savedAccess.email,
            };
            return { user: authUser };
        });
    }
}