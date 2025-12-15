import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  APP_CONTAINER_NAME: Joi.string().optional(),
  APP_PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  APP_CPU_LIMIT: Joi.string().optional(),
  APP_MEM_LIMIT: Joi.string().optional(),

  // Database (para Supabase o Postgres)
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.string().valid('true', 'false').optional(),
  DB_SSL_REJECT_UNAUTHORIZED: Joi.string().valid('true', 'false').optional(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  // Supabase
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
  SUPABASE_ANON_FRONTEND: Joi.string().optional(),
  SUPABASE_BUCKET: Joi.string().required(),
});
