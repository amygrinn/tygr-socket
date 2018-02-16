import { StoreConfig, Reducer, Effects, Middleware } from '@tygr/core';

import { SOCKET } from '../SOCKET';
import { statePieceMiddleware } from '../state-piece.middleware';

import { ClientSocket } from './socket.client.model';
import { socketClientReducer } from './socket.client.reducer';
import { socketClientEffects } from './socket.client.effects';


export class SocketClientConfig implements StoreConfig {
  name = SOCKET;
  reducer = socketClientReducer;
  effects = socketClientEffects;
  middlewares = [statePieceMiddleware];
  ws = 'ws://localhost:4200';
}

export type Socket = {
  socket : Partial<SocketClientConfig>
}