
import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class Blocktoken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  token: string;
}
