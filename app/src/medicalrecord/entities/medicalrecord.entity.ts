import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Pet } from 'src/pet/entities/pet.entity';
import { Diagnosis } from 'src/diagnosis/entities/diagnosis.entity';

@Entity('medical_record')
export class MedicalRecord {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    //Relation with pet entity
    @ManyToOne(() => Pet, (pet) => pet.medicalRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_pet' })
    pet: Pet;

    //Relation with diagnosis entity
    @ManyToOne(() => Diagnosis, (diagnosis) => diagnosis.medicalRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_diagnosis' })
    diagnosis: Diagnosis;
}
