import { Column, CreateDateColumn } from 'typeorm';
import { Gender } from '../../enums/user-gender.enum';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class SubscribeUser {
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Username must have a minimum length of 4 characters',
  })
  @MaxLength(20, {
    message: 'Username must have a maximum length of 20 characters',
  })
  username: string;

  phoneNumber: string;

  gender: Gender;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
