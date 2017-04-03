import {WebSocket} from 'tabris';
import Events from '../lib/Events';
import settings from './settings';

const PROTOCOL = 'player';

export default class WSClient extends Events {

  constructor() {
    super();
    this._queue = [];
    settings.on('change:serverUrl', () => this._connect());
    this._connect();
  }

  _connect() {
    if (this._socket) {
      this._socket.close();
    }
    let url = settings.serverUrl.replace(/^[a-z]+:/, 'ws:');
    this._socket = new WebSocket(url, PROTOCOL);
    this._socket.onopen = event => this._onOpen(event);
    this._socket.onmessage = event => this._onMessage(event);
    this._socket.onerror = event => this._onError(event);
    this._socket.onclose = event => this._onClose(event);
  }

  _onOpen() {
    console.info('WS connection opened');
    for (let cmd of this._queue) {
      this._sendCmd(cmd);
    }
    this._queue = [];
    this.trigger('connected');
  }

  _onError(event) {
    console.info('WS connection error', event);
  }

  _onClose() {
    console.info('WS connection closed');
  }

  _onMessage(event) {
    if (typeof event.data === 'string') {
      let data = JSON.parse(event.data);
      if (data.topic) {
        this.trigger('message:' + data.topic, data.args);
      }
    }
  }

  sendCmd(command, args) {
    if (this._socket.readyState === WebSocket.OPEN) {
      this._sendCmd({command, args});
    } else {
      this._queue.push({command, args});
      if (this._socket.readyState !== WebSocket.CONNECTING) {
        this._connect();
      }
    }
  }

  _sendCmd(cmd) {
    this._socket.send(JSON.stringify(cmd));
  }

}
