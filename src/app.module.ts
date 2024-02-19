import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MapPointsModule } from './map-point/map-point.module';
import { MailModule } from './mail/mail.module';

import { join } from 'path';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            password: process.env.DB_PASSWORD,
            username: process.env.DB_USERNAME,
            entities: ['dist/**/*.entity{.ts,.js}'],
            database: process.env.DB_NAME,
            synchronize: true,
            logging: true,
            ssl: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/static',
        }),
        UserModule,
        AuthModule,
        MapPointsModule,
        MailModule,
    ],
})
export class AppModule {}
