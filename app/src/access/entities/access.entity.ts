import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity('access')
export class Access {
    @PrimaryGeneratedColumn()
    id_access: number;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    @Exclude()
    password: string;

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

    // relations with User entity
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'id_user' })
    user: User;

    // relations with Role entity
    @ManyToOne(() => Role, { eager: false })
    @JoinColumn({ name: 'id_role' })
    role: Role;
}