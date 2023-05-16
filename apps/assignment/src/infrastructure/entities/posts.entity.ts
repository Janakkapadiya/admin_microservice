import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar', { length: 255, nullable: true })
  content: string;

  @Column()
  @Exclude()
  userId: number;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
  })
  user: User;
}
