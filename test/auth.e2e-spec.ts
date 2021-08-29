import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';


//apply a globally scoped pipe to incorporate ValidationPipes and SEssion object to app test instance, inside app.module extracting it from main.ts

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  xit('handles a signup request, POST req. to /auth/signup', () => {
    const email = 'asdf@asdf.com';
    const password = 'asdf';
    return request(app.getHttpServer())
      .post('auth/signup')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
  it('signup as a new user and then get its currently logged in user', async () => {
    //use /whoami route
    const email = 'asdf@asdf.com';
    const password = 'asdf';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201);

    //get cookie insede response
    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(email);
  });
});
