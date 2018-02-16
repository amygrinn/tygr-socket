import { Action } from '@tygr/core';

import * as SocketActions from './socket.actions';

export function ofClientType(type: string): (action: Action) => boolean {
  return (action: Action) => {
    if(action.type === SocketActions.CLIENT_ACTION) {
      if((action as SocketActions.ClientAction).action.type === type) {
        return true;
      }
    }
    return false;
  }
}