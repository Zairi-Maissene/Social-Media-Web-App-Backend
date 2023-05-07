import { JoinTable } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  username: string;
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
}
