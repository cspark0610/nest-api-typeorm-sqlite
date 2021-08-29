import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    //console.log(req.session.userId);
    //have to use an instance of usersService which uses
    //THIS PARAM DECORATOR EXISTS OUTSIDE THE DI SYSTEM cannot
    //get an instance of UsersService DIRECTLY!

    //GONNA USE req.session.userId TO FIND THE USER BY ID AND SEND IT TO THE CLIENT
    // i have to do this with an INTERCEPTOR

    return req.currentUser;
  }
);
