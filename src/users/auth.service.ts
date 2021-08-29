import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';

//promisify to use scrypt function as a promise and NO with callbacks
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //1. see if email is in use find method from usersService
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email already in use');
    }
    // 2. hash and salt user password
    // 2.1 generate a salt (random salt)
    const salt = randomBytes(8).toString('hex');
    //16 length random string

    // 2.2 hash the salt and the password together (scrypt fron crypto library)
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //devolveme 32 caracteres como password hasheada

    // 2.3 join the hashed password and the salt together
    const result = salt + '.' + hash.toString('hex');

    //create new user and save it using userServices method
    const bodyUser = { email, password: result };
    const user = await this.usersService.create(bodyUser);

    //return the user to the controller
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    //destructuring first user found!
    if (!user) {
      throw new NotFoundException('user not found');
    }
    //password va a venir como salt.hashedpassword

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //tengo que comparar storedHashed con hash y si son iguales el signin es valido y retorno al user encontrado
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password provided!!');
    }
    return user;
  }
}
