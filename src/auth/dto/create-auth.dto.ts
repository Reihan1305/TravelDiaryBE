import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    name:string;
    @IsEmail()
    email:string;
    password:string;
    phone:string;
    photoProfile:string
}
