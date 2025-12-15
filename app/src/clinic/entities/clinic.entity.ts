import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ClinicSchedule } from "src/clinic_schedule/entities/clinic_schedule.entity";
import { Access } from "src/access/entities/access.entity";
@Entity('clinic')
export class Clinic {
    @PrimaryGeneratedColumn()
    id_clinic: number;

    @Column({ type: 'varchar', nullable: true })
    image_url?: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    clinic_name: string;

    @Column({ type: 'varchar', length: 200 })
    address: string;

    @Column({ type: 'varchar', length: 100 })
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

    @Column({ name: 'id_access', type: 'int', unique: true, nullable: true })
    id_access: number | null;

    @OneToOne(() => Access, { nullable: true })
    @JoinColumn({ name: 'id_access', referencedColumnName: 'id_access' })
    access: Access;
}