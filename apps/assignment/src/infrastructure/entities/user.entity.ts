import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Posts } from './posts.entity';
import { Role } from '@app/shared/domain/enums/Roles.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'user_email',
  })
  email: string;

  @Column({
    name: 'user_name',
  })
  name: string;

  @Column({
    name: 'user_password',
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
