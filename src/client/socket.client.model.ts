export class ClientSocket {
  connected: boolean;
  clientToServerActions: string[];
}

export const initialState: ClientSocket = {
  connected: false,
  clientToServerActions: []
};
