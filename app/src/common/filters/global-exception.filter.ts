import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly adapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.adapterHost,
            ctx = host.switchToHttp(),
            req = ctx.getRequest<Request>(),
            isHttp = exception instanceof HttpException,
            status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const isProd = process.env.NODE_ENV === 'production';

        let message = 'Internal server error';
        if (isHttp) {
            const res = exception.getResponse() as any;
            message = res?.message ?? exception.message;
        } else if (!isProd) {
            message = (exception as any)?.message ?? message;
        }
        httpAdapter.reply(
            ctx.getResponse(),
            {
                success: false,
                statusCode: status,
                error: { message },
                path: (req as any).originalUrl ?? req.url,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}