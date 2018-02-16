import { ServerStoreConfig } from './server-store-config';

export type ServerConfig = {
  port: number,
  angular?: { staticDirs: string[], index: string },
  ws: string,
  serverStoreConfigs?: ServerStoreConfig[]
};
