import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// ENTITIES
import { Role } from '../roles/entities/role.entity';
import { Gender } from '../gender/entities/gender.entity';
import { Animal } from '../animal/entities/animal.entity';
import { Race } from '../race/entities/race.entity';
import { AppointmentStatus } from '../appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes } from '../appointmentstypes/entities/appointments_types.entity';
import { JobPosition } from '../jobposition/entities/jobposition.entity';
import { Clinic } from '../clinic/entities/clinic.entity';
import { ClinicSchedule } from '../clinic_schedule/entities/clinic_schedule.entity';

import { User } from '../users/entities/user.entity';
import { Pet } from '../pet/entities/pet.entity';
import { PetUser } from '../pet_user/entities/pet_user.entity';
import { Personal } from '../personal/entities/personal.entity';
import { Access } from '../access/entities/access.entity';
import { Diagnosis } from '../diagnosis/entities/diagnosis.entity';
import { MedicalRecord } from '../medicalrecord/entities/medicalrecord.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

// SEED DATA
import { ROLE_SEED } from './seed/roles.seed';
import { GENDER_SEED } from './seed/genders.seed';
import { ANIMAL_SEED } from './seed/animals.seed';
import { RACE_SEED } from './seed/race.seed';
import { APPOINTMENT_STATUS_SEED } from './seed/appointment-statuses.seed';
import { APPOINTMENT_TYPE_SEED } from './seed/appointments-types.seed';
import { JOB_POSITIONS_SEED } from './seed/job-position.seed';
import { CLINIC_SEED } from './seed/clinic.seed';
import { CLINIC_SCHEDULE_SEED } from './seed/clinic-schedule.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Gender)
    private readonly genderRepo: Repository<Gender>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(Race)
    private readonly raceRepo: Repository<Race>,
    @InjectRepository(AppointmentStatus)
    private readonly appointmentStatusRepo: Repository<AppointmentStatus>,
    @InjectRepository(AppointmentsTypes)
    private readonly appointmentTypeRepo: Repository<AppointmentsTypes>,
    @InjectRepository(JobPosition)
    private readonly jobPositionRepo: Repository<JobPosition>,
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
    @InjectRepository(ClinicSchedule)
    private readonly clinicScheduleRepo: Repository<ClinicSchedule>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    @InjectRepository(PetUser)
    private readonly petUserRepo: Repository<PetUser>,
    @InjectRepository(Personal)
    private readonly personalRepo: Repository<Personal>,
    @InjectRepository(Access)
    private readonly accessRepo: Repository<Access>,
    @InjectRepository(Diagnosis)
    private readonly diagnosisRepo: Repository<Diagnosis>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async onModuleInit() {
    this.logger.log('Checking if database seeding is required...');
    await this.run();
  }

  async run(): Promise<void> {
    const alreadySeeded = await this.isDatabaseSeeded();
    if (alreadySeeded) {
      this.logger.log('Database already seeded. Skipping seeding process ✅');
      return;
    }

    this.logger.log('Database appears empty. Running seeders...');

    await this.seedCatalogs();
    const { users, pets, veterinarians, clinics } =
      await this.seedUsersPetsAndVets();
    await this.seedAppointmentsAndRecords(users, pets, veterinarians, clinics);

    this.logger.log('✅ Seeding completed successfully!');
  }

  // ######## INITIAL CHECK ########

  private async isDatabaseSeeded(): Promise<boolean> {
    const [users, roles, clinics] = await Promise.all([
      this.userRepo.count(),
      this.roleRepo.count(),
      this.clinicRepo.count(),
    ]);

    // Use roles as the main indicator that seeding already happened
    const seeded = roles > 0;

    this.logger.log(
      `Seed check: users=${users}, roles=${roles}, clinics=${clinics}, seeded=${seeded}`,
    );

    return seeded;
  }

  // ######## 1. CATALOGS ########

  private async seedCatalogs() {
    this.logger.log('Seeding catalog tables...');

    // ROLES
    if ((await this.roleRepo.count()) === 0) {
      await this.roleRepo.save(this.roleRepo.create(ROLE_SEED));
    }

    // GENDERS
    if ((await this.genderRepo.count()) === 0) {
      await this.genderRepo.save(this.genderRepo.create(GENDER_SEED));
    }

    // ANIMALS
    if ((await this.animalRepo.count()) === 0) {
      await this.animalRepo.save(this.animalRepo.create(ANIMAL_SEED));
    }

    // RACES
    if ((await this.raceRepo.count()) === 0) {
      await this.raceRepo.save(this.raceRepo.create(RACE_SEED));
    }

    // APPOINTMENT STATUS
    if ((await this.appointmentStatusRepo.count()) === 0) {
      await this.appointmentStatusRepo.save(
        this.appointmentStatusRepo.create(APPOINTMENT_STATUS_SEED),
      );
    }

    // APPOINTMENT TYPES
    if ((await this.appointmentTypeRepo.count()) === 0) {
      await this.appointmentTypeRepo.save(
        this.appointmentTypeRepo.create(APPOINTMENT_TYPE_SEED),
      );
    }

    // JOB POSITIONS
    if ((await this.jobPositionRepo.count()) === 0) {
      await this.jobPositionRepo.save(
        this.jobPositionRepo.create(JOB_POSITIONS_SEED),
      );
    }

    // CLINICS
    if ((await this.clinicRepo.count()) === 0) {
      await this.clinicRepo.save(this.clinicRepo.create(CLINIC_SEED));
    }

    // CLINIC SCHEDULES (respecting UNIQUE(day_of_week))
    if ((await this.clinicScheduleRepo.count()) === 0) {
      const clinics = await this.clinicRepo.find();

      if (!clinics.length) {
        this.logger.warn(
          'No clinics found. Skipping clinic_schedule seeding.',
        );
      } else {
        // Because day_of_week is UNIQUE in the database,
        // we can only insert one set of days (Mon–Fri) for ONE clinic.
        const mainClinic = clinics[0];

        const schedulesToSave: ClinicSchedule[] = CLINIC_SCHEDULE_SEED.map(
          (s) =>
            this.clinicScheduleRepo.create({
              ...s,
              clinic: mainClinic,
            }),
        );

        await this.clinicScheduleRepo.save(schedulesToSave);
      }
    }

    this.logger.log('Catalog tables seeding done ✅');
  }

  // ######## 2. USERS (100), PETS (1–2 per user), VETS ########

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomItem<T>(arr: T[]): T {
    return arr[this.randomInt(0, arr.length - 1)];
  }

  private async seedUsersPetsAndVets() {
    this.logger.log(
      'Seeding 100 users, pets, vets, personal & access records...',
    );

    const genders = await this.genderRepo.find();
    const animals = await this.animalRepo.find();
    const races = await this.raceRepo.find();
    const clinics = await this.clinicRepo.find();

    const roleClient = await this.roleRepo.findOne({
      where: { role_name: 'CLIENT' },
    });
    const roleVet = await this.roleRepo.findOne({
      where: { role_name: 'VET' },
    });
    const jobVet = await this.jobPositionRepo.findOne({
      where: { job_position_name: 'Médico veterinario' },
    });

    if (!roleClient || !roleVet || !jobVet) {
      this.logger.error(
        'Missing roles or job positions for CLIENT/VET. Check seed data.',
      );
      throw new Error('Missing roles or job positions');
    }

    // 🔐 Hash passwords once and reuse
    const vetPlainPassword = 'Vet123*';
    const userPlainPassword = 'User123*';

    const hashedVetPassword = await bcrypt.hash(vetPlainPassword, 10);
    const hashedUserPassword = await bcrypt.hash(userPlainPassword, 10);

    const createdUsers: User[] = [];
    const createdPets: Pet[] = [];
    const createdVets: Personal[] = [];

    // 2.1 Create 100 users
    for (let i = 1; i <= 100; i++) {
      const gender = this.randomItem(genders);

      const user = this.userRepo.create({
        full_name: `User ${i}`,
        age: this.randomInt(18, 70),
        address: `Address #${i}`,
        phone_number: `3000000${i.toString().padStart(3, '0')}`,
        identification_number: `ID${i.toString().padStart(6, '0')}`,
        isActive: true,
        gender,
      });

      createdUsers.push(user);
    }

    await this.userRepo.save(createdUsers);

    // 2.2 Create 1–2 pets per user + pet_user relation
    for (const user of createdUsers) {
      const numberOfPets = this.randomInt(1, 2);

      for (let i = 0; i < numberOfPets; i++) {
        const animal = this.randomItem(animals);
        const race = this.randomItem(races);

        const pet = this.petRepo.create({
          pet_name: `${animal.animal_name} of ${user.full_name} #${i + 1}`,
          birth_date: new Date(),
          isActive: true,
          animal,
          race,
        });

        const savedPet = await this.petRepo.save(pet);
        createdPets.push(savedPet);

        const petUser = this.petUserRepo.create({
          user,
          pet: savedPet,
          isActive: true,
        });

        await this.petUserRepo.save(petUser);
      }
    }

    // 2.3 Create at least 5 veterinarians (Personal) with VET role
    const vetUsers = createdUsers.slice(0, 5); // first 5 users
    const vetsPersonal: Personal[] = [];

    for (let i = 0; i < vetUsers.length; i++) {
      const user = vetUsers[i];

      const personal = this.personalRepo.create({
        user,
        jobPosition: jobVet,
        isActive: true,
      });

      const savedPersonal = await this.personalRepo.save(personal);
      vetsPersonal.push(savedPersonal);

      // Access record for vet (hashed password)
      const access = this.accessRepo.create({
        email: `vet${i + 1}@vetconnect.com`,
        password: hashedVetPassword,
        isActive: true,
        user,
        role: roleVet,
      });

      await this.accessRepo.save(access);
    }

    // 2.4 Remaining users as clients (access with CLIENT role)
    const clientUsers = createdUsers.slice(5);

    for (let i = 0; i < clientUsers.length; i++) {
      const user = clientUsers[i];

      const access = this.accessRepo.create({
        email: `user${i + 1}@example.com`,
        password: hashedUserPassword,
        isActive: true,
        user,
        role: roleClient,
      });

      await this.accessRepo.save(access);
    }

    this.logger.log(
      `Created ${createdUsers.length} users, ${createdPets.length} pets, ${vetsPersonal.length} vets.`,
    );

    return {
      users: createdUsers,
      pets: createdPets,
      veterinarians: vetsPersonal,
      clinics,
    };
  }

  // ######## 3. APPOINTMENTS, DIAGNOSES, MEDICAL RECORDS ########

  private async seedAppointmentsAndRecords(
    users: User[],
    pets: Pet[],
    veterinarians: Personal[],
    clinics: Clinic[],
  ) {
    this.logger.log('Seeding diagnoses, medical records and appointments...');

    const statuses = await this.appointmentStatusRepo.find();
    const types = await this.appointmentTypeRepo.find();

    const diagnosesToSave: Diagnosis[] = [];
    const recordsToSave: MedicalRecord[] = [];
    const appointmentsToSave: Appointment[] = [];

    // 1 diagnosis per pet
    for (const pet of pets) {
      const vet = this.randomItem(veterinarians);

      const diagnosis = this.diagnosisRepo.create({
        description: `Diagnosis for ${pet.pet_name}`,
        isActive: true,
        personal: vet,
      });

      diagnosesToSave.push(diagnosis);
    }

    const savedDiagnoses = await this.diagnosisRepo.save(diagnosesToSave);

    // Map diagnosis per pet → create medical records & appointments
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      const diagnosis = savedDiagnoses[i];

      const petUserRelation = await this.petUserRepo.findOne({
        where: { pet: { id_pet: pet.id_pet } as any },
        relations: ['user'],
      });

      if (!petUserRelation) continue;

      const medicalRecord = this.medicalRecordRepo.create({
        pet,
        diagnosis,
        isActive: true,
      });

      recordsToSave.push(medicalRecord);

      const clinic = this.randomItem(clinics);
      const status = this.randomItem(statuses);
      const type = this.randomItem(types);

      const appointment = this.appointmentRepo.create({
        description: `Appointment for ${pet.pet_name}`,
        isActive: true,
        pet,
        user: petUserRelation.user,
        diagnosis,
        type,
        status,
        clinic,
      });

      appointmentsToSave.push(appointment);
    }

    await this.medicalRecordRepo.save(recordsToSave);
    await this.appointmentRepo.save(appointmentsToSave);

    this.logger.log(
      `Created ${savedDiagnoses.length} diagnoses, ${recordsToSave.length} medical records and ${appointmentsToSave.length} appointments.`,
    );
  }
}

