import { Module } from '@nestjs/common';
import { Nest1Service } from './nest1.service';
import { Nest1Controller } from './nest1.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/nestUser.entity';
import { Chats } from './entities/chat.entity'


@Module({
  controllers: [Nest1Controller],
  providers: [Nest1Service],
  imports: [TypeOrmModule.forFeature([Users, Chats])]
})
export class Nest1Module { }
