import { IsString } from 'class-validator';

export class CreateUserDto {
  //dtos always make use of class-validator Decorators function
  @IsString()
  email: string;

  @IsString()
  password: string;
}
