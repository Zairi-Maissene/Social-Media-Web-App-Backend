
import { JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import {Post } from '../../post/entities/post.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  username: string;
  @Column()
  phoneNumber: string;
  @Column()
  gender: string;
  @Column()
  image: string;
  @Column()
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

  @OneToMany((type) => Post, (Post) => Post.owner,{cascade:true})
  posts: Post[];
}
