import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterUser {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
