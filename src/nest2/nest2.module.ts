import { Module } from '@nestjs/common';
import { Nest2Service } from './nest2.service';
import { Nest2Controller } from './nest2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from 'src/nest1/entities/chat.entity';
import { Users } from 'src/nest1/entities/nestUser.entity';
import { TelegramModule } from 'src/telegram/telegram.module'
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';



@Module({
  controllers: [Nest2Controller],
  providers: [Nest2Service,
    JwtStrategy
  ],
  imports: [TypeOrmModule.forFeature([Chats, Users]),
    TelegramModule,
    PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
  ],
})
export class Nest2Module { }
