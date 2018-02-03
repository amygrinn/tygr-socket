import 'rxjs/add/operator/filter';

import { Effects, Action, Store, Actions$, ofType} from '@tygr/core';

import { socketConfig, SocketConfig } from '../socket.config';

import { SocketService } from './socket.service';

export const socketClientEffects: Effects = (
  actions$: Actions$,
  store: Store,
  socketService: SocketService
) => {
  
  socketConfig().then((config: SocketConfig ) => {
    const clientToServerActions: string[] = [].concat(
      ...config.serverConfigs.map(
        serverConfig => serverConfig.clientToServerActions
      )
    );
  
    actions$.filter(action => clientToServerActions.includes(action.type))
      .subscribe(action => {
        socketService.send(action);
      });
  });
  
}
