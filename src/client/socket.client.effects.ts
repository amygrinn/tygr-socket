import 'rxjs/add/operator/filter';

import { Effects, Action, Store, Actions$, ofType} from '@tygr/core';

import { SocketService } from './socket.service';
import * as SocketClientSelectors from './socket.client.selectors';

export const socketClientEffects: Effects = (
  actions$: Actions$,
  store: Store,
  socketService: SocketService
) => {

  actions$
    .filter(action => store.select(SocketClientSelectors.clientToServerActions).includes(action.type))
    .subscribe(action => {
      socketService.send(action);
    });
}
