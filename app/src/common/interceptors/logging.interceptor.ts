import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, finalize, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp(),
            req = http.getRequest<any>(),
            res = http.getResponse<any>();
        const method = req.method,
            url = req.originalUrl ?? req.url,
            start = Date.now();
        let errorStatus: number | null = null;
        
        return next.handle().pipe(
            catchError((err) => {
                errorStatus = err instanceof HttpException ? err.getStatus() : 500;
                this.logger.warn(`${method} ${url} -> ${errorStatus} (error)`);
                return throwError(() => err);
            }),
            finalize(() => {
                const ms = Date.now() - start;
                const status = errorStatus ?? res.statusCode ?? 200;
                this.logger.log(`${method} ${url} -> ${status} (${ms}ms)`);
            }),
        );
    }
}