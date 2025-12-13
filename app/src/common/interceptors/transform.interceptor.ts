import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    meta: {
        timestamp: string;
        path: string;
    };
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> {
        const req = context.switchToHttp().getRequest<{ url?: string; originalUrl?: string }>();
        const path = req.originalUrl ?? req.url ?? '';

        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                meta: {
                    timestamp: new Date().toISOString(),
                    path,
                },
            })),
        );
    }
}