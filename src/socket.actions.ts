import { Action } from '@tygr/core';

import { SOCKET } from './SOCKET';

export class RegisterClientToServerActions implements Action {
  readonly type = REGISTER_CLIENT_TO_SERVER_ACTIONS;

  constructor(public actions: string[]) { }
}

export class ClientConnect implements Action {
  readonly type = CLIENT_CONNECT;

  constructor(public sessionId: string) { }
}

export class ServerConnect implements Action {
  readonly type = SERVER_CONNECT;
}

export class ClientDisconnect implements Action {
  readonly type = CLIENT_DISCONNECT;

  constructor(public sessionId: string) { }
}

export class ServerDisconnect implements Action {
  readonly type = SERVER_DISCONNECT;
}

export class ClientAction implements Action {
  readonly type = CLIENT_ACTION;

  constructor(public sessionId: string, public action: Action) { }
}

export class ServerToClientAction implements Action {
  readonly type = SERVER_TO_CLIENT_ACTION;

  constructor(public sessionIds: string[], public action: Action) { }
}

export const REGISTER_CLIENT_TO_SERVER_ACTIONS = SOCKET + ': Register Client to Server Actions';
export const CLIENT_CONNECT = SOCKET + ': Client Connect';
export const SERVER_CONNECT = SOCKET + ': Server Connect';
export const CLIENT_DISCONNECT = SOCKET + ': Client Disconnect';
export const SERVER_DISCONNECT = SOCKET + ': Server Disconnect';
export const CLIENT_ACTION = SOCKET + ': Client Action';
export const SERVER_TO_CLIENT_ACTION = SOCKET + ': Server to Client Action';