import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiAuthDoc = (options?: { roles?: string[] }) => {
    const decorators = [
        ApiBearerAuth('access-token'),
        ApiUnauthorizedResponse({ description: 'Unauthorized (missing/invalid JWT)' }),
    ];
    if (options?.roles?.length) {
        decorators.push(
            ApiForbiddenResponse({
                description: `Forbidden (requires roles: ${options.roles.join(', ')})`,
            }),
        );
    }
    return applyDecorators(...decorators);
};