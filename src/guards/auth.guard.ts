import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
//import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  //constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    return userId;
  }
}
