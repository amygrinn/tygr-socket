import { StoreConfig } from '@tygr/core';

import { SOCKET } from '../SOCKET';
import { statePieceMiddleware } from '../state-piece.middleware';

import { socketClientReducer } from './socket.client.reducer';
import { socketClientEffects } from './socket.client.effects';

export const socketClientConfig: StoreConfig = {
  name: SOCKET,
  reducer: socketClientReducer,
  effects: socketClientEffects,
  middlewares: [statePieceMiddleware]
}
