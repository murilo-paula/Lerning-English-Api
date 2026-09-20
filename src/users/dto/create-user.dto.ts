import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {

    @IsString({message: "It has to be a text"})
    name: string

    @IsEmail({}, {message: "It has to be an email"})
    @IsNotEmpty({message: "It cant be empty"})
    email: string


    @IsString({message: "It has to be a text"})
    @IsNotEmpty({message: "It cant be empty"})
    password: string
}
