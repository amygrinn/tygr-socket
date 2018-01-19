import { Observable } from 'rxjs/Observable';

import {
  TygrStore,
  Selector,
  actions$,
  effectsMiddleware,
  StoreConfig,
  Unsubscribe
} from '@tygr/core';

import { statePieceMiddleware } from '../state-piece.middleware';
import { socketServerConfig } from './socket.server.config';

import { ServerStoreConfig } from '../server-store-config';

import socketConfig from '../socket.config';

export class ServerStore {

  public static select<T>(selector: Selector<T>): T {
    return ServerStore.instance.select(selector);
  }

  public static select$<T>(selector: Selector<T>): Observable<T> {
    return ServerStore.instance.select$(selector);
  }

  public static dispatch(action) {
    return ServerStore.instance.dispatch(action);
  }

  public static getState() {
    return ServerStore.instance.getState();
  }

  public static subscribe(listener) {
    return ServerStore.instance.subscribe(listener);
  }

  private static _instance: TygrStore;
  private static get instance(): TygrStore {
    if (!ServerStore._instance) {
      ServerStore._instance = new TygrStore([
        socketServerConfig,
        ...socketConfig.serverConfigs
      ])

      socketConfig.serverConfigs.forEach((storeConfig: ServerStoreConfig) => {
        if (storeConfig.effects) {
          storeConfig.effects(actions$, ServerStore.instance, storeConfig.service);
        }
      });
    }

    return ServerStore._instance;
  }
}
