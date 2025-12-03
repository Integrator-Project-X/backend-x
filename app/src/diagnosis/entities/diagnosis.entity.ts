import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Personal } from "src/personal/entities/personal.entity";
import { MedicalRecord } from "src/medicalrecord/entities/medicalrecord.entity";
@Entity('diagnosis')
export class Diagnosis {
    @PrimaryGeneratedColumn()
    id_diagnosis: number;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    //Relations with pet entity
    @ManyToOne(()=> Personal, (personal) => personal.id_personal, {eager:true})
    personal:Personal;

    //Relation with medical record entity
    @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.diagnosis)
medicalRecords: MedicalRecord[];

}