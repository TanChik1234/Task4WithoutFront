
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { People } from './people.entity';
import { Species } from './species.entity';
import { Films } from './films.entity';
import { Images } from './images.entity';

@Entity()
export class Planets{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  rotation_period?: number;

  @Column({ nullable: true })
  orbital_period?: number;  

  @Column({ nullable: true })
  diameter?: number; 

  @Column({ nullable: true })
  climate?: string;   

  @Column({ nullable: true })
  gravity?: string;

  @Column({ nullable: true })
  terrain?: string;  

  @Column({ nullable: true })
  surface_water?: number;

  @Column({ nullable: true })
  population?: number;  

  @OneToMany(() => People, people => people.homeworld)
  residents?: People[];

  @OneToMany(() => Species, specie => specie.homeworld, { cascade: true })
  species?: Species[];

  @ManyToMany(() => Films, films => films.planets)
  films?: Films[];

  @OneToMany(() => Images, image => image.planets)
  images?: Images[];

  @Column('text')
  created: string;

  @Column('text')
  edited: string;

  @Column('text')
  url: string

}
