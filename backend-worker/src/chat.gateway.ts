import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat-message.schema';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    private userSockets = new Map<string, string>();

    constructor(
        @InjectModel(ChatMessage.name) private chatModel: Model<ChatMessage>,
    ) { }

    afterInit(server: Server) {
        this.logger.log('🚀 ChatGateway Inicializado com Sucesso!');
    }

    handleConnection(client: Socket) {
        this.logger.log(`🔗 Cliente Conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        for (const [email, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(email);
                this.logger.log(`❌ Usuário Offline: ${email}`);
                break;
            }
        }
    }

    @SubscribeMessage('identify')
    handleIdentify(@MessageBody() email: string, @ConnectedSocket() client: Socket): void {
        if (!email) return;
        this.userSockets.set(email, client.id);
        this.logger.log(`👤 IDENTIFY: ${email} -> ${client.id}`);

        client.join('grupo_geral');
        client.emit('identified', { status: 'ok', email });
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        client.join(room);
        this.logger.log(`🛋️ Sala Acessada: ${room}`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { sender: string; receiver: string; message: string; isGroup?: boolean },
        @ConnectedSocket() client: Socket
    ): Promise<void> {
        this.logger.log(`📩 MENSAGEM: ${data.sender} -> ${data.receiver}`);

        try {
            const chatMsg = new this.chatModel({
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                timestamp: new Date().toISOString()
            });
            const saved = await chatMsg.save();

            if (data.isGroup) {
                this.server.to(data.receiver).emit('receive_message', saved);
            } else {
                const targetSocketId = this.userSockets.get(data.receiver);
                if (targetSocketId) {
                    this.server.to(targetSocketId).emit('receive_message', saved);
                }
                client.emit('receive_message', saved);
            }
        } catch (e) {
            this.logger.error(`🚨 Falha no Gateway: ${e.message}`);
        }
    }
}
