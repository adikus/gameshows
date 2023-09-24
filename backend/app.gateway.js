import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway {
    @SubscribeMessage('jeopardy:subscribe')
    jeopardySubscribe(socket, payload) {
        if (payload.token) {
            socket.join(`jeopardy:room:${payload.token}`)
            socket.to(`jeopardy:room:${payload.token}`).emit('jeopardy:join');
        }
    }

    @SubscribeMessage('jeopardy:broadcast')
    jeopardyBroadcast(socket, payload) {
        if (payload.token && payload.state) {
            socket.to(`jeopardy:room:${payload.token}`).emit('jeopardy:state', payload.state);
        }
    }
}
