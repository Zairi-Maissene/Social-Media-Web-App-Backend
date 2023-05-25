import {Column, CreateDateColumn} from "typeorm";
import {Gender} from "../../enums/user-gender.enum";
import {IsEmail, IsNotEmpty} from "class-validator";
export class SubscribeUser {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    phoneNumber: string;

    gender: Gender;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;


}
