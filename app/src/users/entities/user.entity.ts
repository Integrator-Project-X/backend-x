import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Gender } from 'src/gender/entities/gender.entity';

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

    @ManyToOne(() => Gender, { eager: true })
    @JoinColumn({ name: 'id_gender' })
    gender: Gender;
}