import { ServerConfig } from '@tygr/socket';

export const serverConfig: ServerConfig = {
  port: 4100,
  angular: {
    staticDirs: ['dist'],
    index: 'dist/index.html'
  },
  ws: 'ws://localhost:4100',
  serverStoreConfigs: []
};
