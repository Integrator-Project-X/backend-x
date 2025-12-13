import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.deco';

export interface AuthDecoratorOptions {
    roles?: string[];
}

export const Auth = (options?: AuthDecoratorOptions) => {
    const decorators = [UseGuards(JwtAuthGuard, RolesGuard)];
    if (options?.roles?.length) {
        decorators.push(Roles(...options.roles));
    }
    return applyDecorators(...decorators);
};