
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Planets } from './planets.entity';
import { Starships } from './starships.entity';
import { Vehicles } from './vehicles.entity';
import { Species } from './species.entity';
import { People } from './people.entity';
import { Images } from './images.entity';

@Entity()
export class Films {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  episode_id?: number;

  @Column({ nullable: true })
  opening_crawl?: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true })
  producer?: string

  @Column({ nullable: true })
  release_date?: string

  @ManyToMany(() => People, people => people.films)
  characters?: People[]

  @ManyToMany(() => Planets, planet => planet.films, { cascade: true })
  @JoinTable()
  planets?: Planets[]

  @ManyToMany(() => Starships, starship => starship.films, { cascade: true })
  @JoinTable()
  starships?: Starships[]

  @ManyToMany(() => Vehicles, vehicle => vehicle.films, { cascade: true })
  @JoinTable()
  vehicles?: Vehicles[]

  @ManyToMany(() => Species, specie => specie.films, { cascade: true })
  @JoinTable()
  species?: Species[]

  @OneToMany(() => Images, image => image.films)
  images?: Images[];

  @Column('text')
  created: string;

  @Column('text')
  edited: string;

  @Column('text')
  url: string
  savedFilm: any[];

}
