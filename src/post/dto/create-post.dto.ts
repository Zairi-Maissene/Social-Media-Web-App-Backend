import { CreateReusableDto } from "src/reusable/dto/create-reusable.dto";
import {User} from "../../user/entities/user.entity";

export class CreatePostDto  extends CreateReusableDto {
    
    content :string ;
    imageUrl : String;
    owner : any ;

}
