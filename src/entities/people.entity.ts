
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Planets } from './planets.entity';
import { Starships } from './starships.entity';
import { Vehicles } from './vehicles.entity';
import { Species } from './species.entity';
import { Films } from './films.entity';
import { Images } from './images.entity';

@Entity()
export class People {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  mass?: number;  

  @Column({ nullable: true })
  hair_color?: string;

  @Column({ nullable: true })
  skin_color?: string;

  @Column({ nullable: true })
  eye_color?: string;

  @Column({ nullable: true })
  birth_year?: string;

  @Column({ nullable: true })
  gender?: 'male' | 'female';

  @ManyToOne(() => Planets, planet => planet.residents, { cascade: true })
  homeworld?: Planets;

  @ManyToMany(() => Films, films => films.characters, { cascade: true })
  @JoinTable()
  films?: Films[];

  @ManyToMany(() => Species, specie => specie.people, { cascade: true })
  @JoinTable()
  species?: Species[];

  @ManyToMany(() => Vehicles, vehicle => vehicle.pilots, { cascade: true })
  @JoinTable()
  vehicles?: Vehicles[];

  @ManyToMany(() => Starships, starship => starship.pilots, { cascade: true })
  @JoinTable()
  starships?: Starships[];

  @OneToMany(() => Images, image => image.people)
  images?: Images[];

  @Column('text')
  created: string;

  @Column('text')
  edited: string;

  @Column('text')
  url: string
  

}
