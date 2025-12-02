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
import { JobpositionModule } from './jobposition/jobposition.module';
import { RaceModule } from './race/race.module';
import { AnimalModule } from './animal/animal.module';
import { PetModule } from './pet/pet.module';
import { ClinicModule } from './clinic/clinic.module';
import { ClinicScheduleModule } from './clinic_schedule/clinic_schedule.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AccessModule } from './access/access.module';
import { PetUserModule } from './pet_user/pet_user.module';

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
    RolesModule,
    JobpositionModule,
    RaceModule,
    AnimalModule,
    PetModule,
    ClinicModule,
    ClinicScheduleModule,
    UsersModule,
    AccessModule,
    PetUserModule,
    ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
