/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET = 'socket';


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@tygr/core");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Angular requires Zone.js
//import 'zone.js/dist/zone-node';
const express = __webpack_require__(4);
const bodyParser = __webpack_require__(5);
const path = __webpack_require__(6);
const WebSocket = __webpack_require__(7);
const http = __webpack_require__(8);
const uuid = __webpack_require__(9);
const SocketActions = __webpack_require__(3);
const server_store_1 = __webpack_require__(11);
const socket_config_1 = __webpack_require__(16);
const app = express();
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const configPath = path.join(__dirname, 'src/configs');
let sessions = {};
function sendActionToClients(action) {
    action.sessionIds.forEach(id => {
        if (sessions[id]) {
            sessions[id].send(JSON.stringify(action.action));
        }
    });
}
exports.sendActionToClients = sendActionToClients;
socket_config_1.socketConfig().then((config) => {
    server_store_1.ServerStore.init(config);
    if (config.angular) {
        if (config.angular.staticDirs) {
            config.angular.staticDirs.forEach(dir => {
                app.use(express.static(path.join(configPath, dir), { index: false }));
            });
        }
        app.get('/*', (req, res) => {
            res.sendFile(path.join(configPath, config.angular.index));
        });
    }
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    const clientToServerActions = [].concat(...config.serverConfigs.map(serverConfig => serverConfig.clientToServerActions));
    wss.on('connection', (ws, req) => {
        const id = uuid.v4();
        ws['_id'] = id;
        sessions[id] = ws;
        ws['isAlive'] = true;
        ws.on('pong', () => ws['isAlive'] = true);
        ws.send(JSON.stringify(new SocketActions.ServerConnect()));
        server_store_1.ServerStore.dispatch(new SocketActions.ClientConnect(id));
        ws.on('message', data => {
            const action = JSON.parse(data.toString());
            if (clientToServerActions.some(type => type === action.type)) {
                server_store_1.ServerStore.dispatch(new SocketActions.ClientAction(id, action));
            }
        });
        ws.on('close', () => {
            server_store_1.ServerStore.dispatch(new SocketActions.ClientDisconnect(id));
        });
    });
    const interval = setInterval(() => {
        wss.clients.forEach(function each(ws) {
            if (ws['isAlive'] === false) {
                server_store_1.ServerStore.dispatch(new SocketActions.ClientDisconnect(ws['_id']));
                return ws.terminate();
            }
            ws['isAlive'] = false;
            ws.ping(() => { });
        });
    }, 10000);
    server.listen(config.port, () => {
        console.log(`Listening on http://localhost:${config.port}`);
    });
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SOCKET_1 = __webpack_require__(0);
class ClientConnect {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.type = exports.CLIENT_CONNECT;
    }
}
exports.ClientConnect = ClientConnect;
class ServerConnect {
    constructor() {
        this.type = exports.SERVER_CONNECT;
    }
}
exports.ServerConnect = ServerConnect;
class ClientDisconnect {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.type = exports.CLIENT_DISCONNECT;
    }
}
exports.ClientDisconnect = ClientDisconnect;
class ServerDisconnect {
    constructor() {
        this.type = exports.SERVER_DISCONNECT;
    }
}
exports.ServerDisconnect = ServerDisconnect;
class ClientAction {
    constructor(sessionId, action) {
        this.sessionId = sessionId;
        this.action = action;
        this.type = exports.CLIENT_ACTION;
    }
}
exports.ClientAction = ClientAction;
class ServerToClientAction {
    constructor(sessionIds, action) {
        this.sessionIds = sessionIds;
        this.action = action;
        this.type = exports.SERVER_TO_CLIENT_ACTION;
    }
}
exports.ServerToClientAction = ServerToClientAction;
exports.CLIENT_CONNECT = SOCKET_1.SOCKET + ': Client Connect';
exports.SERVER_CONNECT = SOCKET_1.SOCKET + ': Server Connect';
exports.CLIENT_DISCONNECT = SOCKET_1.SOCKET + ': Client Disconnect';
exports.SERVER_DISCONNECT = SOCKET_1.SOCKET + ': Server Disconnect';
exports.CLIENT_ACTION = SOCKET_1.SOCKET + ': Client Action';
exports.SERVER_TO_CLIENT_ACTION = SOCKET_1.SOCKET + ': Server to Client Action';


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

/*global window, require, define */
(function(_window) {
  'use strict';

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;

  function setupBrowser() {
    // Allow for MSIE11 msCrypto
    var _crypto = _window.crypto || _window.msCrypto;

    if (!_rng && _crypto && _crypto.getRandomValues) {
      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
      //
      // Moderately fast, high quality
      try {
        var _rnds8 = new Uint8Array(16);
        _whatwgRNG = _rng = function whatwgRNG() {
          _crypto.getRandomValues(_rnds8);
          return _rnds8;
        };
        _rng();
      } catch(e) {}
    }

    if (!_rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var  _rnds = new Array(16);
      _mathRNG = _rng = function() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
      if ('undefined' !== typeof console && console.warn) {
        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
      }
    }
  }

  function setupNode() {
    // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
    //
    // Moderately fast, high quality
    if (true) {
      try {
        var _rb = __webpack_require__(10).randomBytes;
        _nodeRNG = _rng = _rb && function() {return _rb(16);};
        _rng();
      } catch(e) {}
    }
  }

  if (_window) {
    setupBrowser();
  } else {
    setupNode();
  }

  // Buffer class to use
  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) === 'string') {
      buf = (options === 'binary') ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;
  uuid._rng = _rng;
  uuid._mathRNG = _mathRNG;
  uuid._nodeRNG = _nodeRNG;
  uuid._whatwgRNG = _whatwgRNG;

  if (('undefined' !== typeof module) && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else if (true) {
    // Publish as AMD module
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {return uuid;}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


  } else {
    // Publish as global (in browsers)
    _previousRoot = _window.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _window.uuid = _previousRoot;
      return uuid;
    };

    _window.uuid = uuid;
  }
})('undefined' !== typeof window ? window : null);


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(1);
const socket_server_config_1 = __webpack_require__(12);
class ServerStore {
    static select(selector) {
        return ServerStore.instance.select(selector);
    }
    static select$(selector) {
        return ServerStore.instance.select$(selector);
    }
    static dispatch(action) {
        return ServerStore.instance.dispatch(action);
    }
    static getState() {
        return ServerStore.instance.getState();
    }
    static subscribe(listener) {
        return ServerStore.instance.subscribe(listener);
    }
    static init(config) {
        const serverStoreConfigs = [socket_server_config_1.socketServerConfig, ...config.serverConfigs];
        ServerStore.instance = new core_1.TygrStore(serverStoreConfigs);
        serverStoreConfigs.forEach((storeConfig) => {
            if (storeConfig.effects) {
                storeConfig.effects(core_1.actions$, ServerStore.instance, storeConfig.service);
            }
        });
    }
}
exports.ServerStore = ServerStore;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SOCKET_1 = __webpack_require__(0);
const state_piece_middleware_1 = __webpack_require__(13);
const socket_server_effects_1 = __webpack_require__(14);
exports.socketServerConfig = {
    name: SOCKET_1.SOCKET,
    effects: socket_server_effects_1.socketServerEffects,
    middlewares: [state_piece_middleware_1.statePieceMiddleware]
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.statePieceMiddleware = store => next => action => {
    for (let key in Object.keys(action)) {
        if (action[key] instanceof Function) {
            action[key] = action[key](store.getState());
        }
    }
    return next(action);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(15);
const core_1 = __webpack_require__(1);
const SocketActions = __webpack_require__(3);
const server_1 = __webpack_require__(2);
exports.socketServerEffects = (actions$, store) => {
    actions$
        .filter(core_1.ofType(SocketActions.SERVER_TO_CLIENT_ACTION))
        .subscribe((action) => server_1.sendActionToClients(action));
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("rxjs/add/operator/filter");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(1);
const SOCKET_1 = __webpack_require__(0);
class SocketConfig {
    constructor() {
        this.port = 4200;
        this.angular = {
            staticDirs: ['../../dist'],
            index: '../../dist/index.html'
        };
        this.ws = 'ws://localhost:4200';
    }
}
exports.SocketConfig = SocketConfig;
const baseConfig = new SocketConfig();
function socketConfig() {
    return core_1.getConfig(SOCKET_1.SOCKET).then(conf => {
        return Object.assign({}, baseConfig, conf);
    });
}
exports.socketConfig = socketConfig;


/***/ })
/******/ ]);