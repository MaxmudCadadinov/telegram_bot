import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AdminChatGateway {
    @WebSocketServer()
    server: Server;

    // 👇 Отправка сообщения админу (из телеграм-бота)
    sendToAdmin(message: { user_id: number; text: string, files?: any[] }) {
        this.server.emit('from_user', message);
    }



}
