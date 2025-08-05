import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service'
import { Nest1Module } from 'src/nest1/nest1.module';
import { Chats } from 'src/nest1/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/nest1/entities/nestUser.entity';
import { Files } from 'src/nest1/entities/file.entity';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
  imports: [Nest1Module, TypeOrmModule.forFeature([Chats, Users, Files])]
})
export class TelegramModule { }
