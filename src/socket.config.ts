import { getConfig } from '@tygr/core';

import { SOCKET } from './SOCKET';
import { ServerStoreConfig } from './server-store-config';

export class SocketConfig {
    port: number = 4200;
    angular?: { staticDirs: string[], index: string } = {
        staticDirs: ['../../dist'],
        index: '../../dist/index.html'
    };
    serverConfigs?: ServerStoreConfig[];
    ws: string = 'ws://localhost:4200';
}

const baseConfig = new SocketConfig();

export function socketConfig(): Promise<SocketConfig> {
    return getConfig(SOCKET).then(conf => {
        return { ...baseConfig, ...conf };
    });
}
