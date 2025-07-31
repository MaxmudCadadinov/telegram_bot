import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config'

import { TypeOrmModule } from '@nestjs/typeorm';
import { Nest1Module } from './nest1/nest1.module';
import { Nest2Module } from './nest2/nest2.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '5588',
    database: 'tgbot',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
    Nest1Module,
    Nest2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
