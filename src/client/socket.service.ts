import { Injectable } from '@angular/core';

import { Store, Actions$, StoreService } from '@tygr/core';

import { SOCKET_CONFIG } from '../socket.config.i';

@Injectable()
export class SocketService extends StoreService {
  constructor(
    private actions$: Actions$,
    private store: Store
  ) {
    super(actions$, store, null);
  }
}