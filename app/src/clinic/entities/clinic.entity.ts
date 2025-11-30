import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ClinicSchedule } from "src/clinic_schedule/entities/clinic_schedule.entity";
@Entity('clinic')
export class Clinic {
    @PrimaryGeneratedColumn()
    id_clinic: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    clinic_name: string;

    @Column({ type: 'varchar', length: 200 })
    address: string;

    @Column({ type: 'varchar', length: 15 })
    phone_number: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    identification_number: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations with clinic_schedule
    @OneToMany(() => ClinicSchedule, (clinicSchedule) => clinicSchedule.clinic)
    clinicSchedule: ClinicSchedule[];
}