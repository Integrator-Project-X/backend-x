import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('appointments_types')
export class AppointmentsTypes {
    //Define the entity columns here

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'is_Active', default: true})
    is_active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    //Relations with appointment entity
    @OneToMany(() => Appointment, (appointment) => appointment.type)
    appointment: Appointment[];
}
