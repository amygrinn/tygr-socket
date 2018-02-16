import { Socket } from '@tygr/socket';

import { SocketModule } from '@tygr/socket';

export const tygrConfig: (
  Socket
) = {
  socket: {
    ws: 'ws://localhost:4100'
  }
};
