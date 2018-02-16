import { Selector } from '@tygr/core';

import { SOCKET } from '../SOCKET';
import { ClientSocket } from './socket.client.model';

const getState: Selector<ClientSocket> = (state) => state[SOCKET];

export const clientToServerActions: Selector<string[]> = (state) => getState(state).clientToServerActions;

export const isConnected: Selector<boolean> = (state) => getState(state).connected;