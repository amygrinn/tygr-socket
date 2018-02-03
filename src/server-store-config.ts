import { Reducer, Action, Effects, Middleware, StoreConfig } from '@tygr/core';

export interface ServerStoreConfig extends StoreConfig {
  name: string;
  reducer?: Reducer<any>;
  effects?: Effects;
  middlewares?: Middleware[];
  service?: any;
  clientToServerActions?: string[];
}
