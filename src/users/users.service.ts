import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(body: CreateUserDto) {
    //look at reposotoryAPI of typeorm
    //create() creates AN INSTANCE BUT NOT PERSIST IN DB
    //save() takes the instance created and make this ones persist in DB

    const user = this.repository.create(body);
    //user is an instance  created by repositoryAPI of class User Entity
    return this.repository.save(user);
    //note on save method
    //if i save an instance of an entity ALL THE HOOKS ASOCIATED ARE EXECUTED!
    //if a pass an object to save method HOOKS ARE NOT EXECUTED
  }
  findOne(id: number) {
    //always return only one record or if id received is null or undefined return null
    return id ? this.repository.findOne(id) : null;
  }

  find(email: string) {
    return this.repository.find({ email: email });
    //returns always an Array
  }
  // findAll() {
  //   return this.repository.find();
  // }

  //i need to pass a new object as a second argument in method Update()
  //type definition i can update email , password OR both at the same time
  //Partial, type Helper that tells typescript that i can pass a flexible object of type User Entity
  async update(id: number, attrs: Partial<User>) {
    const foundUser = await this.findOne(id);
    //first i need to fetch an INSTANCE of an user
    if (!foundUser) {
      throw new NotFoundException(`user with id ${id} does not exists`);
    }
    //apply save method to the instance updated
    //overwrite foundUser with Object.assign() using new updated object attrs which comes as an argument
    Object.assign(foundUser, attrs);
    return this.repository.save(foundUser);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user you want to delete not found!!');
    }
    return this.repository.remove(user);
  }
}
