/* eslint no-global-assign: off */

// polyfill installs fetch on self
global.self = global;

// polyfill replaces Promise object, restore original
let promiseBackup = Promise;
let tabris = require('tabris');
Promise = promiseBackup;

class ClientMock {

  constructor() {
    this._widgets = {};
  }

  create(cid, type, properties) {
    this._widgets[cid] = {type, props: {}};
    Object.assign(this._widgets[cid].props, properties);
  }

  set(cid, properties) {
    if (!(cid in this._widgets)) {
      this._widgets[cid] = {props: {}};
    }
    Object.assign(this._widgets[cid].props, properties);
  }

  get(cid, name) {
    let value = cid in this._widgets ? this._widgets[cid].props[name] : undefined;
    if (name === 'bounds' && !value) {
      value = [0, 0, 0, 0];
    }
    return value;
  }

  call() {
  }

  listen() {
  }

  destroy() {
  }

}

class TabrisMock {

  constructor(client) {
    this.client = client;
  }

  fakeDevice(properties) {
    let widget = this.client._widgets['tabris.Device'];
    let props = Object.assign({}, widget && widget.props, properties);
    this.client.set('tabris.Device', props);
  }

}

export function startTabris() {
  let clientMock = new ClientMock();
  let tabrisMock = new TabrisMock(clientMock);
  tabris._init(clientMock);
  tabrisMock.fakeDevice({
    platform: 'test',
    version: '1.2.3',
    model: 'testmodel',
    screenWidth: 480,
    screenHeight: 720,
    orientation: 'portrait',
    scaleFactor: 2
  });
  tabris.crypto = createCrypto();
  tabris.localStorage = createStorage();
  return tabrisMock;
}

function createCrypto() {
  return {
    getRandomValues(typedArray) {
      let values = new Uint8Array(typedArray.byteLength);
      for (let i = 0; i < values.length; i++) {
        values[i] = Math.floor(Math.random() * 256);
      }
      new Uint8Array(typedArray.buffer).set(values);
    }
  };
}

function createStorage() {
  return {
    _items: {},
    getItem(name) {
      return this._items['' + name] || null;
    },
    setItem(name, value) {
      this._items['' + name] = '' + value;
    },
    removeItem(name) {
      delete this._items['' + name];
    },
    clear() {
      this._items = {};
    }
  };
}
