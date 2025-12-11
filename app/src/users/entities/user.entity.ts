import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Gender } from 'src/gender/entities/gender.entity';
import { PetUser } from 'src/pet_user/entities/pet_user.entity';
import { Personal } from 'src/personal/entities/personal.entity';
import { Access } from 'src/access/entities/access.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ type: 'varchar', length: 150 })
    full_name: string;

    @Column({ type: 'int', nullable: true })
    age: number;

    @Column({ type: 'varchar', length: 200 })
    address: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    identification_number: string;

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

    // Relation with Gender entity
    @ManyToOne(() => Gender, { eager: true })
    @JoinColumn({ name: 'id_gender' })
    gender: Gender;

    // Relations with PetUser entity
    @OneToMany(() => PetUser, (petUser) => petUser.user)
    petUsers: PetUser[];

    // Relations with Personal entity
    @OneToMany(() => Personal, (personal) => personal.user)
    personals: Personal[];

    // Relations with Access entity
    @OneToMany(() => Access, (access) => access.user)
    accesses: Access[];

    // Relations with Appointment entity
    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}