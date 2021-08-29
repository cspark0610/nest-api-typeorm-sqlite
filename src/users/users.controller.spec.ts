import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  //usersController has 2 dependencies injections authService and usersService
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number): Promise<User> => {
        return Promise.resolve({
          id,
          email: 'lala@lala.com',
          password: 'lala'
        } as User);
      },
      find: (email: string): Promise<User[]> => {
        return Promise.resolve([
          {
            id: Math.floor(Math.random() * 999),
            email,
            password: '1234'
          } as User
        ]);
      }
      //remove: () => {},
      //update: () => {}
    };
    fakeAuthService = {
      //need to implement fake signup and signin methods
      //signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };
    //isolated DI usersController container
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService }
      ]
    }).compile();
    //Received: everything provided as a fake service
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  //test findUsers and find method WHITOUT DECORATORS
  it('findAllUsers method returns an array of one user given an unique email', async () => {
    const users = await controller.findAllUsers('pepe@pepe.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('pepe@pepe.com');
  });
  it('findUser method returns a single user given an id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  xit('findUser method returns an error if user with given id is not found', async (done) => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (error) {
      done();
    }
  });

  //sign in controller test
  //debo tester que el metodo sign retirne un user y que el id sea seteado dento del objeto session
  it('sign in and updates session object ans return an user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'pepe@pepe.com', password: 'asdf' },
      session
    );
    expect(user.id).toEqual(1); //becuase of hardcoded method signin
    expect(session.userId).toEqual(1);
  });
});
