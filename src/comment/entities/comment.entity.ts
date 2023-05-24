import { Reusable } from "src/reusable/entities/reusable.entity";
import { User } from "../../user/entities/user.entity";
import { Post} from "../../post/entities/post.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Comment extends Reusable{
    @Column()
    content: String;
    @ManyToOne((type) => User, {eager: true})
    @JoinColumn({
        name: 'writer_id',
        referencedColumnName: 'id',
      })
    writer: User;
    @ManyToOne((type)=> Post, {eager : true})
    @JoinColumn({
        name: 'post_id',
        referencedColumnName: 'id',
      })
    post: Post ;
}
