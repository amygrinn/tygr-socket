// Angular requires Zone.js
//import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as WebSocket from 'ws';
import * as http from 'http';
import * as uuid from 'node-uuid';

import { Action } from 'redux';
import * as SocketActions from '../socket.actions';
import { ClientToServerAction, ServerToClientAction } from '../transmission';

import { ServerStore } from './server.store';

import { socketServerConfig } from './socket.server.config';

import { serverConfig } from '../../../../tygr.server.config';

const app = express();

app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let sessions = {};

export function sendActionToClients(action: SocketActions.ServerToClientAction) {
  action.sessionIds.forEach(id => {
    if(sessions[id]) {
      sessions[id].send(JSON.stringify(action.action));
    }
  });
}

if(serverConfig.angular) {
  
  if(serverConfig.angular.staticDirs) {
    serverConfig.angular.staticDirs.forEach(dir => {
      app.use(express.static(
        dir, 
        { index: false }
      ));
    });
  }

  app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, serverConfig.angular.index));
  });
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clientToServerActions: string[] = [].concat(
  ...serverConfig.serverStoreConfigs.map(
    config => config.clientToServerActions
  )
);

wss.on('connection', (ws, req) => {

  const id = uuid.v4();

  ws['_id'] = id;
  sessions[id] = ws;

  ws['isAlive'] = true;
  ws.on('pong', () => ws['isAlive'] = true);

  ws.send(JSON.stringify(new SocketActions.ServerConnect()));
  ServerStore.dispatch(new SocketActions.ClientConnect(id));

  ws.on('message', data => {
    const action: Action = JSON.parse(data.toString()) as Action;
    if(clientToServerActions.some(type => type === action.type)) {
      ServerStore.dispatch(new SocketActions.ClientAction(id, action));
    }
  });

  ws.on('close', () => {
    ServerStore.dispatch(new SocketActions.ClientDisconnect(id));
  });
});

const interval = setInterval(
  () => {
    wss.clients.forEach(function each(ws) {
      if (ws['isAlive'] === false) {
        ServerStore.dispatch(new SocketActions.ClientDisconnect(ws['_id']));
        return ws.terminate();
      }

      ws['isAlive'] = false;
      ws.ping(() => {});
    });
  },
  10000
);


server.listen(serverConfig.port, () => {
  console.log(`Listening on http://localhost:${serverConfig.port}`);
});
