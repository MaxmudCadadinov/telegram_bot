import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config'

import { TypeOrmModule } from '@nestjs/typeorm';
import { Nest1Module } from './nest1/nest1.module';
import { Nest2Module } from './nest2/nest2.module';
import { WebsocketService } from './websocket/websocket.service';
import { WebsocketModule } from './websocket/websocket.module';


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
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketService],
})
export class AppModule { }
