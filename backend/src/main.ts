import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'my_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/',
  });
  await app.listen(4000);
}
bootstrap().then();
