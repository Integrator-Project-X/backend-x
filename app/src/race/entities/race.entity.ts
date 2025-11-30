import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pet } from "src/pet/entities/pet.entity";

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

    //Relations with pet entity
    @OneToMany(()=> Pet, (pet) => pet.race)
    pet:Pet[];
}