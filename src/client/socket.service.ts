import { Injectable } from '@angular/core';

import { Store, Actions$, Action, StoreService } from '@tygr/core';

import { socketClientConfig } from './socket.client.config';

import { socketConfig, SocketConfig } from '../socket.config';
import * as SocketActions from '../socket.actions';

@Injectable()
export class SocketService extends StoreService {
  
  private socket: WebSocket;
  
  constructor(
    private actions$: Actions$,
    private store: Store
  ) {
    super(actions$, store, socketClientConfig);

    socketConfig().then((config: SocketConfig) => {
      this.socket = new WebSocket(config.ws);
      this.socket.onmessage = (event: MessageEvent) => {
        store.dispatch(JSON.parse(event.data) as Action);
      }

      this.socket.onclose = () => {
        store.dispatch(new SocketActions.ServerDisconnect());
      }
    });
  }

  public send(action: Action) {
    this.socket.send(action);
  }
}