import {CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
@Entity()
export abstract class Reusable {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({update:false,nullable:false})
    createdAt : Date ;

    @UpdateDateColumn({nullable:true})
    updatedAt : Date ;

    @DeleteDateColumn()
    deletedAt:Date ;
}
