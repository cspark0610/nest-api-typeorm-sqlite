import { Expose, Exclude } from 'class-transformer';
//defualt way to display an user as a response in a public route

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
