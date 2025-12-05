import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // ============================
    // APP
    // ============================
    APP_CONTAINER_NAME: Joi.string().optional(),
    APP_PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    APP_CPU_LIMIT: Joi.string().optional(),
    APP_MEM_LIMIT: Joi.string().optional(),

    // ============================
    // PostgreSQL local (Docker)
    // ============================
    DB_CONTAINER_NAME: Joi.string().optional(),

    POSTGRES_HOST: Joi.string().optional(),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_USER: Joi.string().optional(),
    POSTGRES_PASSWORD: Joi.string().optional(),
    POSTGRES_DB: Joi.string().optional(),
    POSTGRES_LOCAL: Joi.number().optional(),

    // ============================
    // Supabase (DB_*)
    // ============================
    DB_HOST: Joi.string().optional(),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().optional(),
    DB_PASSWORD: Joi.string().optional(),
    DB_NAME: Joi.string().optional(),

    DB_SSL: Joi.boolean().default(false),
    DB_SSL_REJECT_UNAUTHORIZED: Joi.boolean().default(false),

    // ============================
    // JWT
    // ============================
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('24h'),
});
