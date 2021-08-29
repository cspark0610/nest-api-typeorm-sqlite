/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
DI system in auth.service.spec.ts
class AuthService <- MOCK/ fakeUsersService instance
AuthService -> fakeUsersService

METHODS DEPENDENCY (only need to fake find and create meethod of usersService)
authService.signup() -> usersService.find() & usersService.create()
authService.signin() -> usersService.find() 

DI system when app runs normally
AuthService -> UserService -> UsersRepo -> SQlite
*/

import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService; //top most scoped always
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of usersService
    // Partial typescript keyword says we are trying to make a Partial versio of a generic type UsersService

    const users: User[] = [];
    fakeUsersService = {
      //fake find methos returns an array of users filtered by email
      find: (email: string): Promise<User[]> => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      //   create: (body: CreateUserDto) =>
      //     Promise.resolve({
      //       id: 1,
      //       email: body.email,
      //       password: body.password
      //     } as User)
      create: (body: CreateUserDto): Promise<User> => {
        const createdUser = {
          id: Math.floor(Math.random() * 777),
          email: body.email,
          password: body.password
        } as User;
        users.push(createdUser);
        return Promise.resolve(createdUser);
      }
    };
    const moduleRef = await Test.createTestingModule({
      //OVERRIDE DI SYSTEM
      //second item in providers array says, when asked for an instance of UsersService, use fakeUsersService object instead
      // property "provide" means if anyone asks for an instance of whatever class is in at the right side (in this case UsersService)
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });
  it('can create an instance of AuthService', () => {
    expect(authService).toBeDefined();
  });
  //i need that fake find() method returns for this it an empty array
  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup('carlosPark@gmail.com', '123456');
    expect(user.password).not.toEqual('123456');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if an user signs up with an email that already is in use', async (done) => {
    await authService.signup('asdf@asdf.com', 'asdf');
    try {
      await authService.signup('asdf@asdf.com', 'asdf');
    } catch (error) {
      done();
    }
  });

  //sign in flow test
  it('throws error if sign in is called with an email that is not in DB', async (done) => {
    try {
      await authService.signin('njdcnd@gmail.com', 'njcsajn');
    } catch (error) {
      done();
    }
  });
  it('throws an error if and invalid password is provided when i sign in', async (done) => {
    await authService.signup('asdf@gmai.com', 'word');
    try {
      await authService.signin('asdf@gmai.com', 'password');
    } catch (error) {
      done();
    }
  });

  //checking correct password WEAK-APPROACH
  xit('return a signed in user if its correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'asdf@gmail.com',
          password:
            '67985626d4a92ce1.037dbcfd8a5c95c9ab35a73b2d798ea0aa3eec84f377b353d3b5fe735b73a648'
        } as User
      ]);

    //const user = await authService.signup('asdf@gmail.com', 'mypassword');
    //console.log('user', user);
    //in order TO TAKE THE CORRESPONDING HASHED and salted PASSWORD for "mypassword" AND USE IT IN FAKE FIND METHOD

    const signedInUser = await authService.signin(
      'asdf@gmail.com',
      'mypassword'
    );
    expect(signedInUser).toBeDefined();
  });
  //checking password Efficient approach
  it('return a signed in user if its correct password is provided', async () => {
    await authService.signup('asdf@gmail.com', '123');
    const signedInUser = await authService.signin('asdf@gmail.com', '123');
    expect(signedInUser).toBeDefined();
  });
});
