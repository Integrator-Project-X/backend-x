import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { join } from 'path';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { AppointmentstypesModule } from './appointmentstypes/appointmentstypes.module';
import { GenderModule } from './gender/gender.module';
import { AppointmentstatusModule } from './appointmentstatus/appointmentstatus.module';
import { RolesModule } from './roles/roles.module';



// Determine if running inside Docker container
const runningInDocker = process.env.RUNNING_IN_DOCKER === 'true';

//Resolve path to external .env file
const externalEnvPath = join(__dirname, '..', '..', '.env');
@Module({
  imports: [
    //Global configuration module
    ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema: validationSchema,
    ignoreEnvFile: runningInDocker,
    envFilePath: runningInDocker ? undefined : externalEnvPath,
  }),
    DatabaseModule,
    AppointmentstypesModule,
    GenderModule,
    AppointmentstatusModule,
    RolesModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
