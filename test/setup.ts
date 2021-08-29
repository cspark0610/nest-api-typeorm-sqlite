import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
    //'..' subir 1 arriba, remove file "test.sqlite" beforeEach
  } catch (error) {}
});

global.afterEach(async () => {
  //CADA TEST HACE UNA INSTANCIA NUEVA DE LA APP Y DE LA CONEXION A LA DB, TYPEORM TIENE QUE CORTAR LA CONEXION TB A LA DB
  const conn = getConnection();
  await conn.close();
});
