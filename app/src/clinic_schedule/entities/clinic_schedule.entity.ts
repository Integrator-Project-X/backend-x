import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Clinic } from "src/clinic/entities/clinic.entity";

@Entity('clinic_schedule')
export class ClinicSchedule {
    @PrimaryGeneratedColumn()
    id_clinic_schedule: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    day_of_week: string;

    @Column({ type: 'time' })
    open_time: string;

    @Column({ type: 'time' })
    close_time: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations
    @ManyToOne(() => Clinic, (clinic) => clinic.clinicSchedule, {eager : true})
    @JoinColumn({ name: 'id_clinic' })
    clinic: Clinic;
}