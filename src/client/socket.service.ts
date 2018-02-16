import { Injectable } from '@angular/core';

import { Store, Actions$, Action, StoreService } from '@tygr/core';

import { SocketClientConfig } from './socket.client.config';

import * as SocketActions from '../socket.actions';
import { SOCKET } from '../SOCKET';

@Injectable()
export class SocketService extends StoreService {
  
  private socket: WebSocket;
  
  constructor(
    private actions$: Actions$,
    private store: Store
  ) {
    super(actions$, store, new SocketClientConfig());
    const config = store.getConfig(SOCKET) as SocketClientConfig;

    this.socket = new WebSocket(config.ws);
    this.socket.onmessage = (event: MessageEvent) => {
      store.dispatch(JSON.parse(event.data) as Action);
    }

    this.socket.onclose = () => {
      store.dispatch(new SocketActions.ServerDisconnect());
    }
  }

  public send(action: Action) {
    this.socket.send(JSON.stringify(action));
  }
}