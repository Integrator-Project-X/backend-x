import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PetUser } from 'src/pet_user/entities/pet_user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class OwnershipService {
    constructor(
        @InjectRepository(PetUser)
        private readonly petUserRepo: Repository<PetUser>,
        @InjectRepository(Appointment)
        private readonly apptRepo: Repository<Appointment>,
    ) {}
    async isPetOwner(userId: number, petId: number): Promise<boolean> {
        return this.petUserRepo.exist({
            where: {
                user: { id_user: userId } as any,
                pet: { id_pet: petId } as any,
            },
        });
    }
    async isAppointmentOwner(userId: number, appointmentId: number): Promise<boolean> {
        return this.apptRepo.exist({
            where: {
                id: appointmentId,
                user: { id_user: userId } as any,
            } as any,
        });
    }

    async isAppointmentOfClinic(clinicId: number, appointmentId: number): Promise<boolean> {
        return this.apptRepo.exist({
            where: {
                id: appointmentId,
                clinic: { id_clinic: clinicId } as any,
            } as any,
        });
    }
}
