import {JoinColumn, UpdateDateColumn} from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {Reusable} from "../../reusable/entities/reusable.entity";
import { Exclude } from 'class-transformer';

@Entity()
export class FriendRequest extends Reusable{

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

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
