import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { People } from './people.entity';
import { Films } from './films.entity';
import { Images } from './images.entity';

@Entity()
export class Starships {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ nullable: true })
  cost_in_credits?: number;

  @Column({ nullable: true })
  length?: number;

  @Column({ nullable: true })
  max_atmosphering_speed?: string;

  @Column({ nullable: true })
  crew?: number;

  @Column({ nullable: true })
  passengers?: number;

  @Column({ nullable: true })
  cargo_capacity?: number;

  @Column({ nullable: true })
  consumables?: string;  

  @Column({ nullable: true })
  hyperdrive_rating?: number;  

  @Column({ nullable: true })
  MGLT?: number; 

  @Column({ nullable: true })
  starship_class?: string; 


  @ManyToMany(() => People, people => people.starships)
  pilots?: People[];
  
  @ManyToMany(() => Films, films => films.starships)
  films?: Films[];

  @OneToMany(() => Images, image => image.starships)
  images?: Images[];

  @Column('text')
  created: string;

  @Column('text')
  edited: string;

  @Column('text')
  url: string

}
