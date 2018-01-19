import {
  SocketConfig,
  SOCKET,
  socketClientReducer,
  socketClientEffects,
  statePieceMiddleware
} from '@tygr/socket';

const socketConfig: SocketConfig = {
  name: SOCKET,
  reducer: socketClientReducer,
  effects: socketClientEffects,
  middlewares: [statePieceMiddleware],

  port: 4300
};

export default socketConfig;
