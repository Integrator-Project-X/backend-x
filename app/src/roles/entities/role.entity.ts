import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Access } from 'src/access/entities/access.entity';
@Entity('roles')
export class Role {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id_role: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    role_name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // relations with Access entity
    @OneToMany(() => Access, (access) => access.role)
    accesses: Access[];
}