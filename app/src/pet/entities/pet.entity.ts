import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Race } from "../../race/entities/race.entity";
import { Animal } from "src/animal/entities/animal.entity";
import { MedicalRecord } from "src/medicalrecord/entities/medicalrecord.entity";

@Entity('pets')
export class Pet {
    @PrimaryGeneratedColumn()
    id_pet: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    pet_name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    birth_date: Date;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations with  race entity and animal entity
    @ManyToOne(()=> Race, (race) => race.pet, {eager: true})
    @JoinColumn({name: 'id_race'})
    race:Race;

    @ManyToOne(()=> Animal, (animal) => animal.pet, {eager: true})
    @JoinColumn({name: 'id_animal'})
    animal:Animal;

    //Relation with medical record entity
    @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.pet)
    medicalRecords: MedicalRecord[];
}