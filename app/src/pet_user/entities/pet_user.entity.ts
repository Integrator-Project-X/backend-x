import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Pet } from 'src/pet/entities/pet.entity';

@Entity('pet_user')
@Unique(['user', 'pet'])
export class PetUser {
    @PrimaryGeneratedColumn()
    id_pet_user: number;

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

    @ManyToOne(() => Pet, { eager: true })
    @JoinColumn({ name: 'id_pet' })
    pet: Pet;
}