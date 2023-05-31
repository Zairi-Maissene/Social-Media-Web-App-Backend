import {Gender} from "../../enums/user-gender.enum";
import {IsEmail,IsOptional,MinLength,MaxLength} from "class-validator";

export class UpdateUserDto  {
    @MinLength(4,{message:'Username must have a minimum length of 4 characters'})
    @MaxLength(20,{message:'Too long Username'})
    username: string;

@IsOptional()
    phoneNumber: string;
    @IsOptional()

    gender: Gender;
    @IsOptional()

   @IsEmail()
   email: string;
    @IsOptional()

    password: string;

}
