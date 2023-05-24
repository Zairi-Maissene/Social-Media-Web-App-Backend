import { CreateReusableDto } from "src/reusable/dto/create-reusable.dto";

export class CreatePostDto  extends CreateReusableDto {
    
    content :string ;
    imageUrl : String;

}
