import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtUser } from '../strategies/jwt.strategy';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});