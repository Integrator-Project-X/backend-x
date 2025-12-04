import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = {
                    host: configService.get<string>('database.host'),
                    port: configService.get<number>('database.port'),
                    username: configService.get<string>('database.username'),
                    password: configService.get<string>('database.password'),
                    database: configService.get<string>('database.database'),
                    ssl: configService.get<boolean>('database.ssl'),
                    rejectUnauthorized: configService.get<boolean>('database.rejectUnauthorized'),
                };

                if (!dbConfig.host || !dbConfig.port || !dbConfig.username || !dbConfig.password || !dbConfig.database) {
                    throw new Error('Database configuration is incomplete. Please check your environment variables.');
                }

                // Puedes loguear esto para ver qué host ve el contenedor:
                console.log('DB CONFIG:', dbConfig);
                return {
                    type: 'postgres',
                    host: dbConfig.host,
                    port: dbConfig.port,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    database: dbConfig.database,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: ['schema', 'error'],
                    ssl: dbConfig.ssl
                        ? { rejectUnauthorized: dbConfig.rejectUnauthorized }
                        : false,
                };
            },
        }),
    ],
})
export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);

    constructor(@InjectDataSource() private dataSource: DataSource) { }

    async onModuleInit() {
        try {
            await this.dataSource.query('SELECT 1');
            this.logger.log('✔️ Database connection established successfully.');
        } catch (err) {
            this.logger.error('❌ Database connection failed:', err?.message ?? err);
            throw err;
        }
    }
}