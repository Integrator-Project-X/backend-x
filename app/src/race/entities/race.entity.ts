import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('race')
export class Race {
    @PrimaryGeneratedColumn()
    id_race: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    race_name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //relations
}