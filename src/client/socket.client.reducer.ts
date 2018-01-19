import { Reducer, Action } from '@tygr/core';

import { ClientSocket, initialState } from './socket.client.model';

import * as SocketActions from '../socket.actions';

export const socketClientReducer: Reducer<ClientSocket> = (
  state: ClientSocket = initialState,
  action: Action
): ClientSocket => {

  switch (action.type) {
    case SocketActions.SERVER_CONNECT:
      return { connected: true };

    case SocketActions.SERVER_DISCONNECT:
      return { connected: false };

    default:
      return state;
  }
}