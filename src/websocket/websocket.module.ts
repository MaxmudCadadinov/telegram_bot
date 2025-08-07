import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';

@Module({
  controllers: [WebsocketController]
})
export class WebsocketModule {}
