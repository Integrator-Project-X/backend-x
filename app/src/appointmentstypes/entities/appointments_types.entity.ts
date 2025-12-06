import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('appointments_types')
export class AppointmentsTypes {
    //Define the entity columns here

    @PrimaryGeneratedColumn()
    id: number;

    //relations here

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'is_Active', default: true})
    is_active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
