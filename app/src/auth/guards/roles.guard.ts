import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants/auth.constants';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const req = context.switchToHttp().getRequest<{ user?: AuthUser }>();
        const user = req.user;

        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }
        const allowed = requiredRoles.includes(user.roleName);

        if (!allowed) {
            throw new ForbiddenException('Forbidden');
        }
        return true;
    }
}
