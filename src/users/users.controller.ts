import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Session //to extract info of session object
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('/auth') //routes prefix
@Serialize(UserDto) // aplica a TODOS LOS METODO DE ESTA CLASE si o si
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    //this.usersService.create(body);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  //necesito un controller para el signin() authService
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  //controller that returns currently sign in user
  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }
  //i can only access this route only if i am signin , if i am not i will receive a 403response
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  //controller that allows user sign out and sets his session.userId to null
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    console.log('session.userId after signing out', session.userId);
  }

  //@UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  //when a received a request its parametrized url id COMES AS A STRING!
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  // @Get()
  // findAllUsers() {
  //   return this.usersService.findAll();
  // }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
