import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('genders')
export class Gender {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id_gender: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    // Relations

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
