import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { People } from './people.entity';
import { Planets } from './planets.entity';
import { Films } from './films.entity';
import { Images } from './images.entity';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  classification?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ nullable: true })
  average_height?: number;

  @Column({ nullable: true })
  skin_colors?: string;

  @Column({ nullable: true })
  hair_colors?: string;

  @Column({ nullable: true })
  eye_colors?: string;

  @Column({ nullable: true })
  average_lifespan?: number;

  @ManyToOne(() => Planets, planet => planet.species)
  homeworld?:Planets | null;

  @Column({ nullable: true })
  language?: string;  

  @ManyToMany(() => People, people => people.species)
  people?: People[];

  @ManyToMany(() => Films, films => films.species)
  films?: Films[];

  @OneToMany(() => Images, image => image.species)
  images?: Images[];

  @Column('text')
  created: string;

  @Column('text')
  edited: string;

  @Column('text')
  url: string
}
