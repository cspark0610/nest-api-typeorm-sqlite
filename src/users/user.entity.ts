import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  //typeorm hook decorators
  @AfterInsert()
  logInsert() {
    console.log('inserted user with id', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('updated user with id', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('removed user with id', this.id);
  }
}

//2. connect this Entity to his parent module, users.module.ts

//import TypeOrmModule.forFeature([...Entities])

//3. connect this entity to the root connection
// app.module.ts   TypeOrmModule.forRoot({
// entities: [...entities]
//})
