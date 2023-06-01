import { DeleteDateColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { Gender } from '../../enums/user-gender.enum';
import { BaseEntity } from '../../crud/baseentity.entity';

import { Post } from '../../post/entities/post.entity';
import { Reusable } from '../../reusable/entities/reusable.entity';

@Entity()
export class User extends Reusable {
  @Column({ unique: true })
  username: string;
  @Column()
  phoneNumber: string;
  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;
  @Column({
    default:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  })
  image: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  @ManyToMany((type) => User, {})
  @JoinTable({
    name: 'friends',
    joinColumn: {
      name: 'user1',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user2',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  @OneToMany((type) => Post, (Post) => Post.owner, { cascade: true })
  posts: Post[];
  @DeleteDateColumn()
  deletedAt: Date;
}
