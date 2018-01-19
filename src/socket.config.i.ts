import { Middleware, StoreConfig, Reducer, Action } from '@tygr/core';
import { Store } from 'redux';

import { Observable } from 'rxjs/Observable';

import { ServerStoreConfig } from './server-store-config';

import { SOCKET } from './SOCKET';
import { socketClientReducer } from './client/socket.client.reducer';
import { socketClientEffects } from "./client/socket.client.effects";
import { statePieceMiddleware } from "./state-piece.middleware";
import { ClientSocket } from './client/socket.client.model';

export const SOCKET_CONFIG = 'socket.config.ts';

export interface SocketConfig extends StoreConfig {
  port: number;
  angular?: {
    index: string,
    staticDirs?: string[]
  };
  serverConfigs?: ServerStoreConfig[];
}

/*
name = SOCKET;
  reducer = socketClientReducer;
  effects = socketClientEffects;
  middlewares = [statePieceMiddleware];
  */
