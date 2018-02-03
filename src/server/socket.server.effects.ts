import 'rxjs/add/operator/filter';

import { Effects, Action, Store, Actions$, ofType } from '@tygr/core';

import * as SocketActions from '../socket.actions';

import { sendActionToClients } from './server';

export const socketServerEffects: Effects = (
  actions$: Actions$,
  store: Store
) => {
  actions$
    .filter(ofType(SocketActions.SERVER_TO_CLIENT_ACTION))
    .subscribe((action: SocketActions.ServerToClientAction) => sendActionToClients(action));
}