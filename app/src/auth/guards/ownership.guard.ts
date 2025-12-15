import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/constants/auth.constants';
import { OWNERSHIP_KEY, OwnershipConfig } from 'src/auth/decorators/ownership.deco';
import { OwnershipService } from '../ownership/ownership.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly ownership: OwnershipService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const cfg = this.reflector.getAllAndOverride<OwnershipConfig>(OWNERSHIP_KEY, [
            ctx.getHandler(),
            ctx.getClass()]);
        
        if (!cfg) {
            return true;
        }
        const req = ctx.switchToHttp().getRequest<any>(),
            user = req.user;

        if (!user?.userId || !user?.role) {
            return false;
        }
        if (cfg.allowRoles?.includes(user.role)) {
            return true;
        }
        const id = Number(req.params?.[cfg.param]);

        if (!Number.isFinite(id)) {
            return false;
        }
        if (cfg.resource === 'PET') {
            if (user.role !== 'CLIENT') return false;
            return this.ownership.isPetOwner(user.userId, id);
        }
        if (cfg.resource === 'APPOINTMENT') {
            if (user.role === 'CLIENT') {
                return this.ownership.isAppointmentOwner(user.userId, id);
            }
            if (user.role === 'VET') {
                const clinicId = Number(user.clinicId);
                if (!Number.isFinite(clinicId)) {
                    return false;
                }
                return this.ownership.isAppointmentOfClinic(clinicId, id);
            }
            return false;
        }
        return false;
    }
}