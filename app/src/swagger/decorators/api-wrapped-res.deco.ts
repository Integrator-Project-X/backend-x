import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/api-success-res.dto';

export const ApiOkWrapped = <TModel extends Type<unknown>>(
    model: TModel,
    description?: string ) =>
    applyDecorators(
        ApiExtraModels(SuccessResponseDto, model),
        ApiOkResponse({
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(SuccessResponseDto) },
                    { properties: {
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );