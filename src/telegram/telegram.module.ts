import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service' 
import { Nest1Module } from 'src/nest1/nest1.module';
import { Chats } from 'src/nest1/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/nest1/entities/nestUser.entity';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
  imports: [Nest1Module, TypeOrmModule.forFeature([Chats, Users])]
})
export class TelegramModule {}
