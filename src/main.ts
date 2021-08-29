import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { ValidationPipe } from '@nestjs/common';

//import {  } from "cookie-session"
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['asdf']
  //   })
  // );
  // //configure the use of UseGlobalPipes to recieve DtosClasses
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true
  //   })
  //whitelist: true significa que si mando desde el cliente una propiedad que no existe en su Dto, nest me va a eliminar esa propiedad que recibo desde el cliente.
  // ej podria mandar como body para un signup { email: "", password : "", admin: true } sin ser admin
  //);
  await app.listen(3000);
}
bootstrap();
