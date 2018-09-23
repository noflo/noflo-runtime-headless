const { server: WebSocketServer } = require('websocket');
const { EventEmitter } = require('events');
const debug = require('debug');

const debugConnection = debug('noflo-runtime-headless:websocket:connection');
const debugMessageSend = debug('noflo-runtime-headless:websocket:message:send');
const debugMessageReceive = debug('noflo-runtime-headless:websocket:message:receive');

class WebSocketProxy extends EventEmitter {
  constructor(httpServer) {
    super();
    this.wsServer = new WebSocketServer({
      httpServer,
    });
    this.connections = [];
    this.prepare();
  }

  prepare() {
    this.wsServer.on('request', (request) => {
      const subProtocol = (request.requestedProtocols.indexOf('noflo') !== -1) ? 'noflo' : null;
      const connection = request.accept(subProtocol, request.origin);
      debugConnection('New connection', subProtocol, request.origin);
      this.connections.push(connection);
      connection.on('message', (message) => {
        if (message.type !== 'utf8') {
          return;
        }
        debugMessageReceive(message.utf8Data);
        this.emit('message', JSON.parse(message.utf8Data));
      });
      connection.on('close', () => {
        debugConnection('Closed connection', subProtocol, request.origin);
        this.connections = this.connections.filter(c => c !== connection);
      });
    });
  }

  send(message) {
    debugMessageSend(message);
    this.connections.forEach((c) => {
      c.sendUTF(JSON.stringify(message));
    });
  }
}

module.exports = httpServer => Promise.resolve(new WebSocketProxy(httpServer));
