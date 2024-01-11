import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
const passport = require('passport');
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(passport.initialize());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));

    await app.listen(3000);
}

bootstrap();
