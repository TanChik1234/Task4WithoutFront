import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInDto{
  @ApiProperty({description: "Username", example: "Toydarian"})
  @IsString()
  username: string ;

  @ApiProperty({description: "Password", example: "mammal"})
  @IsString()
  password: string;


  [key: string]: string ;
}