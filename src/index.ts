export { SocketConfig } from './socket.config.i';

import * as SocketActions from './socket.actions';
export { SocketActions };

export { ClientToServerAction, ServerToClientAction } from './transmission';

export { ServerStore } from './server/server.store';

export { SOCKET } from './SOCKET';

export { statePieceMiddleware, StatePiece } from './state-piece.middleware';

export { socketClientReducer } from './client/socket.client.reducer';
export { socketClientEffects } from './client/socket.client.effects';
