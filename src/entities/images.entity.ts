import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { People } from './people.entity';
import { Species } from './species.entity';
import { Films } from './films.entity';
import { Starships } from './starships.entity';
import { Vehicles } from './vehicles.entity';
import { Planets } from './planets.entity';

@Entity()
export class Images{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @ManyToOne(() => People, person => person.images, { cascade: true })
  people?: People | undefined;

  @ManyToOne(() => Films, film => film.images, { cascade: true })
  films?: Films | undefined;

  @ManyToOne(() => Planets, planet => planet.images, { cascade: true })
  planets?: Planets | undefined;

  @ManyToOne(() => Species, specie => specie.images, { cascade: true })
  species?: Species | undefined;

  @ManyToOne(() => Starships, starship => starship.images, { cascade: true })
  starships?: Starships | undefined;

  @ManyToOne(() => Vehicles, vehicle => vehicle.images, { cascade: true })
  vehicles?: Vehicles | undefined;
  
}