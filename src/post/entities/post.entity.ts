import { Comment } from 'src/comment/entities/comment.entity';
import { Reusable } from 'src/reusable/entities/reusable.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Post extends Reusable {
  @Column()
  content: String;
  @Column()
  imageUrl: String;
  @ManyToOne((type) => User, {eager :true})
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
  })
  owner: User
 

  @OneToMany((type)=> Comment, (comment)=> comment.post)
  comments : Comment[];

  @ManyToMany((type) => User, {eager :true})
  @JoinTable({
    name: 'likes',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
 likes: User[];
}
