import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from 'src/pet/entities/pet.entity';
import { User } from 'src/users/entities/user.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { AppointmentStatus } from 'src/appointmentstatus/entities/appointmentstatus.entity';
import { AppointmentsTypes} from 'src/appointmentstypes/entities/appointments_types.entity';
import { Diagnosis } from 'src/diagnosis/entities/diagnosis.entity';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn({ name: 'id' })
    id_appointment: number;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @ManyToOne(() => Pet, { eager: true })
    @JoinColumn({ name: 'id_pet' })
    pet: Pet;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => Diagnosis, { eager: true, nullable: true })
    @JoinColumn({ name: 'id_diagnosis' })
    diagnosis?: Diagnosis;

    @ManyToOne(() => AppointmentsTypes, { eager: true })
    @JoinColumn({ name: 'id_type' })
    type: AppointmentsTypes;

    @ManyToOne(() => AppointmentStatus, { eager: true })
    @JoinColumn({ name: 'id_status' })
    status: AppointmentStatus;

    @ManyToOne(() => Clinic, { eager: true })
    @JoinColumn({ name: 'id_clinic' })
    clinic: Clinic;
}