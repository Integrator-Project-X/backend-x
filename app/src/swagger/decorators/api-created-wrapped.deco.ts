import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/api-success-res.dto';

export const ApiCreatedWrapped = <TModel extends Type<unknown>>(
    model: TModel,
    description?: string ) =>
    applyDecorators(
        ApiExtraModels(SuccessResponseDto, model),
        ApiCreatedResponse({
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(SuccessResponseDto) },
                    { properties: { data: { $ref: getSchemaPath(model) } } },
                ],
            },
        }),
    );