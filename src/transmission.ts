import { Action } from '@tygr/core';

export abstract class ClientToServerAction implements Action {
  abstract readonly type: string;
  sessionId?: string;
}

export abstract class ServerToClientAction implements Action {
  abstract readonly type: string;
  public sessionIds?: string[];
}
