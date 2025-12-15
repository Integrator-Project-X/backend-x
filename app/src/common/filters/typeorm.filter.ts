import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import type { Request } from 'express';

type PgDriverError = { code?: string; detail?: string };

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    constructor(private readonly adapterHost: HttpAdapterHost) {}
    
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const { httpAdapter } = this.adapterHost,
            ctx = host.switchToHttp(),
            req = ctx.getRequest<Request>();

        const driverError = (exception as any).driverError as PgDriverError | undefined;
        const code = driverError?.code;

        let status = HttpStatus.BAD_REQUEST,
            message = 'Database error';

        if (code === '23505') {
            status = HttpStatus.CONFLICT;
            message = 'Unique constraint violation';
        } else if (code === '23503') {
            status = HttpStatus.CONFLICT;
            message = 'Foreign key violation';
        } else if (code === '22P02') {
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid input syntax';
        }
        const isProd = process.env.NODE_ENV === 'production';
        httpAdapter.reply(
            ctx.getResponse(),
            {
                success: false,
                statusCode: status,
                error: {
                    message,
                    code,
                    ...(isProd ? {} : { detail: driverError?.detail }),
                },
                path: (req as any).originalUrl ?? req.url,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}