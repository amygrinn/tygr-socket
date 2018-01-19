// Angular requires Zone.js
import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as ExpressWS from 'express-ws';
import * as WebSocket from 'ws';
import * as http from 'http';
import * as uuid from 'node-uuid';

import { Action } from 'redux';
import * as SocketActions from '../socket.actions';
import { ClientToServerAction, ServerToClientAction } from '../transmission';

import { ServerStore } from './server.store';

import socketConfig from '../socket.config';

const app = express();

app.set('view engine', 'html');
app.set('views', __dirname);


socketConfig.angular.staticDirs.forEach(dir => {
  app.use(express.static(dir, { index: false }));
});

app.use(bodyParser.json());

/*
const serverStore = createServerStore();

const sessionsMap = new Map<string, WebSocket>();

function getSessionId(webSocket: WebSocket): string {
  sessionsMap.forEach((ws: WebSocket, id: string) => {
    if (webSocket === ws) {
      return id;
    }
  });
  return '';
}

export function sendActionToClients(action: ServerToClientAction) {
  const sessionIds: string[] = action.sessionIds;

  action.sessionIds = null;

  sessionIds.forEach((sessionId: string) => {
    sessionsMap.get(sessionId).send(action);
  });
}

expressWS.getWss().on('connection', (ws: WebSocket) => {

  const sessionId: string = uuid.v4();

  sessionsMap.set(sessionId, ws);

  const clientConnect: SocketActions.ClientConnect = new SocketActions.ClientConnect();
  clientConnect.sessionId = sessionId;

  serverStore.dispatch(clientConnect);

  serverStore.dispatch(new SocketActions.ServerConnect(sessionId));

});


expressWS.app.ws('/api', (ws: WebSocket) => {

  ws.on('message', (action: ClientToServerAction) => {
    action.sessionId = getSessionId(ws);

    serverStore.dispatch(action);
  });

  ws.on('close', () => {
    const sessionId: string = getSessionId(ws);
    serverStore.dispatch(
      new SocketActions.ClientDisconnect(sessionId),
    );
    sessionsMap.delete(sessionId);
  });
});



app.get('/*', (req: Request, res: Response) => {
  res.render('./dist/index', {
    req: req,
    res: res,
    providers: [{
      provide: 'serverUrl',
      useValue: `${req.protocol}://${req.get('host')}`
    }]
  });
});

const port = process.env.PORT || 4200;
*/

app.listen(socketConfig.port, () => {
  console.log(`Listening on http://localhost:${socketConfig.port}`);
});
