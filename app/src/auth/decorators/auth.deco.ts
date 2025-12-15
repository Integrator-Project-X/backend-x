import { applyDecorators } from '@nestjs/common';
import { Roles } from './roles.deco';

export interface AuthDecoratorOptions {
    roles?: string[];
}

export const Auth = (options?: AuthDecoratorOptions) => {
    const decorators: any[] = [];
    if (options?.roles?.length) {
        decorators.push(Roles(...options.roles));
    }
    return applyDecorators(...decorators);
};