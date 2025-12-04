import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Personal } from "../../personal/entities/personal.entity";

@Entity('job_positions')
export class JobPosition {
    @PrimaryGeneratedColumn()
    id_job_position: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    job_position_name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations with personal
    @OneToMany(() => Personal, (personal) => personal.jobPosition)
    personals: Personal[];
}