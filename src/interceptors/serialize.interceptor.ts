import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
//para poder usarlo de forma generica le paso un constructor y dentro del decorador del controller le paso UserDto
//import { UserDto } from '../users/dtos/user.dto';

interface ClassConstructor {
  new (...args: any[]): {};
}
//interfz que representa cualquier Clase de cualquier tipo

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
//voy a user esta funcion como decorador "custom" dentro del metodo del controlador

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // run something before a req is next is handled by the request next
    //console.log('runnig before the next', context);

    return next.handle().pipe(
      map((data: any) => {
        //run something before the response is sent out
        //seriealize logic here
        const plain = plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        });
        console.log('outside response', plain);
        return plain;
      })
    );
  }
}
