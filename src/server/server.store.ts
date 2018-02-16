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
import { ServerStoreConfig } from '../server-store-config';

import { socketServerConfig } from './socket.server.config';

import { serverConfig } from '../../../../tygr.server.config';

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

  private static get instance(): TygrStore {
    if(!this._instance) {
      const serverStoreConfigs: ServerStoreConfig[] = [ socketServerConfig, ...serverConfig.serverStoreConfigs ];

      this._instance = new TygrStore({}, serverStoreConfigs);

      serverStoreConfigs.forEach((storeConfig: ServerStoreConfig) => {
        if (storeConfig.effects) {
          storeConfig.effects(actions$, ServerStore.instance, storeConfig.service);
        }
      });
    }

   return this._instance; 
  };

  private static _instance: TygrStore;

}
