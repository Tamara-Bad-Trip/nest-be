import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
const passport = require('passport');
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.use(passport.initialize());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));

    const config = new DocumentBuilder().setTitle('bad-trip').addBearerAuth().setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(3001);
}

bootstrap();
