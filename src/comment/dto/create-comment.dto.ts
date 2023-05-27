import { CreateReusableDto } from "src/reusable/dto/create-reusable.dto";

export class CreateCommentDto extends CreateReusableDto{
    content :string ;
    postId : number;
}
