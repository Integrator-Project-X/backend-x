import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    constructor(private readonly adapterHost: HttpAdapterHost) { }
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const { httpAdapter } = this.adapterHost;
        const ctx = host.switchToHttp(),
            req = ctx.getRequest<Request>(),
            status = exception.getStatus(),
            response = exception.getResponse() as any;

        const details = Array.isArray(response?.message)
            ? response.message : [response?.message ?? 'Bad Request'];

        httpAdapter.reply(
            ctx.getResponse(),
            {
                success: false,
                statusCode: status,
                error: {
                    message: 'Validation failed',
                    details,
                },
                path: (req as any).originalUrl ?? req.url,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}