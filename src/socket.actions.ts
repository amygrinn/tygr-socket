import { Action } from '@tygr/core';

import { SOCKET } from './SOCKET';
import { ClientToServerAction, ServerToClientAction } from './transmission';

export class SendToServerFailed implements Action {
  readonly type = SEND_TO_SERVER_FAILED;

  constructor(public reason?: string) { }
}

export class ClientConnect extends ClientToServerAction {
  readonly type = CLIENT_CONNECT;
}

export class ServerConnect extends ServerToClientAction {
  readonly type = SERVER_CONNECT;
}

export class ClientDisconnect implements Action {
  readonly type = CLIENT_DISCONNECT;

  constructor(public sessionId: string) { }
}

export class ServerDisconnect implements Action {
  readonly type = SERVER_DISCONNECT;
}

export const SEND_TO_SERVER_FAILED = SOCKET + ': Send to Server Failed';
export const CLIENT_CONNECT = SOCKET + ': Client Connect';
export const SERVER_CONNECT = SOCKET + ': Server Connect';
export const CLIENT_DISCONNECT = SOCKET + ': Client Disconnect';
export const SERVER_DISCONNECT = SOCKET + ': Server Disconnect';
