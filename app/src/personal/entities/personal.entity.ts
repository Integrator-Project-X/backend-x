import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobPosition } from 'src/jobposition/entities/jobposition.entity';

@Entity('personal')
export class Personal {
    @PrimaryGeneratedColumn()
    id_personal: number;

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

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => JobPosition, { eager: true })
    @JoinColumn({ name: 'id_job_position' })
    jobPosition: JobPosition;
}