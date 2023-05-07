import { JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: string;
  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({
    name: 'sender_id',
    referencedColumnName: 'id',
  })
  sender: User;
  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({
    name: 'receiver_id',
    referencedColumnName: 'id',
  })
  reciever: User;
}
