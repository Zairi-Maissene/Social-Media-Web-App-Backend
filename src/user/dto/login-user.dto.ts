import {IsNotEmpty} from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    login: string; //peut etre un email ou phoneNumber
    @IsNotEmpty()

    password: string;
}