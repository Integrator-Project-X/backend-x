import { Appointment } from "src/appointments/entities/appointment.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity('appointment_statuses')
export class AppointmentStatus {
    @PrimaryGeneratedColumn()
    id_appointment_status: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    status_name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations
    @OneToMany(() => Appointment, (appointment) => appointment.status)
    appointments: Appointment[];
}