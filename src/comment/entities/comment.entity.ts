import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Reusable } from '../../reusable/entities/reusable.entity';

@Entity()
export class Comment extends Reusable {
  @Column()
  content: string;
  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({
    name: 'writer_id',
    referencedColumnName: 'id',
  })
  writer: User;

  @ManyToOne((type) => Post)
  @JoinColumn({
    name: 'post_id',
    referencedColumnName: 'id',
  })
  post: Post;
}
