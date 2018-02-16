import { Reducer, Action } from '@tygr/core';

import { ClientSocket, initialState } from './socket.client.model';

import * as SocketActions from '../socket.actions';

export const socketClientReducer: Reducer<ClientSocket> = (
  state: ClientSocket = initialState,
  action: Action
): ClientSocket => {

  switch (action.type) {
    case SocketActions.SERVER_CONNECT:
      return { ...state, connected: true };

    case SocketActions.SERVER_DISCONNECT:
      return { ...state, connected: false };

    case SocketActions.REGISTER_CLIENT_TO_SERVER_ACTIONS:
      return { 
        ...state,
        clientToServerActions: [
          ...state.clientToServerActions,
          ...(action as SocketActions.RegisterClientToServerActions).actions
        ]}

    default:
      return state;
  }
}
