import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
    constructor(private readonly adapterHost: HttpAdapterHost) { }
    catch(exception: UnauthorizedException | ForbiddenException, host: ArgumentsHost) {
        const { httpAdapter } = this.adapterHost;
        const ctx = host.switchToHttp(),
            status = exception.getStatus(),
            req = ctx.getRequest<Request>();

        httpAdapter.reply(
            ctx.getResponse(),
            {
                success: false,
                statusCode: status,
                error: { message: status === 401 ? 'Unauthorized' : 'Forbidden' },
                path: (req as any).originalUrl ?? req.url,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}