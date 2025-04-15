import { IsEmail, IsJWT, IsString, IsUrl, Matches, MinLength } from "class-validator";

export class AddUserDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    username: string;

    @IsUrl()
    picture: string;

    @IsString()
    @MinLength(8)
    // @Matches(new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/), {
    //   message: 'La password deve avere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale',
    // })
    password: string;
}

export class LoginDTO {
    @IsEmail()
    username: string;
    
    @MinLength(8)
    // @Matches(new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/), {
    //   message: 'La password deve avere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale',
    // })
    password: string;
}

export class RefreshTokenDTO {
    // @IsJWT()
    refreshToken: string;
}