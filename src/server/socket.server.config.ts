import { ServerStoreConfig } from '../server-store-config';
import { SOCKET } from '../SOCKET';
import { statePieceMiddleware } from '../state-piece.middleware';

import { socketServerEffects } from './socket.server.effects';

export const socketServerConfig: ServerStoreConfig = {
    name: SOCKET,
    effects: socketServerEffects,
    middlewares: [statePieceMiddleware]
}
