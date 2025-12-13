import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    private static readonly DUMMY_BCRYPT_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8PCXqZg5e8z5Pj7O7pS8fJYpQvB2G6';
    constructor(
        @InjectRepository(Access)
        private readonly accessRepo: Repository<Access>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
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
    async register(dto: RegisterDto): Promise<{ accessToken: string; user: AuthUser }> {
        const email = dto.email.trim();
        const user = await this.userRepo.findOne({ where: { id_user: dto.id_user } });
        if (!user) throw new BadRequestException(`User with ID "${dto.id_user}" does not exist`);

        const role = await this.roleRepo.findOne({ where: { id_role: dto.id_role } });
        if (!role) throw new BadRequestException(`Role with ID "${dto.id_role}" does not exist`);

        const existing = await this.accessRepo
            .createQueryBuilder('access')
            .select(['access.id_access'])
            .where('LOWER(access.email) = LOWER(:email)', { email })
            .getOne();
        if (existing) {
            throw new BadRequestException('Email is already in use');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const access = this.accessRepo.create({
            email,
            password: passwordHash,
            isActive: true,
            user,
            role,
        });
        const saved = await this.accessRepo.save(access);
        const authUser: AuthUser = {
            accessId: saved.id_access,
            userId: user.id_user,
            roleId: role.id_role,
            roleName: role.role_name,
            email: saved.email,
        };
        const payload: JwtPayload = {
            userId: authUser.userId,
            accessId: authUser.accessId,
            roleId: authUser.roleId,
            roleName: authUser.roleName,
            email: authUser.email,
        };
        const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '15m';
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: expiresIn as any });
        return { accessToken, user: authUser };
    }
}