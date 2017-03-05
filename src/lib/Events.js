export default class Events {

  on(type, listener) {
    if (!this._listeners) {
      this._listeners = [];
    }
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    if (!this._listeners[type].includes(listener)) {
      this._listeners[type].push(listener);
    }
  }

  off(type, listener) {
    if (this._listeners && this._listeners[type]) {
      this._listeners[type] = this._listeners[type].filter(element => element !== listener);
    }
  }

  trigger(type, param) {
    if (this._listeners && this._listeners[type]) {
      for (let listener of this._listeners[type]) {
        listener.call(null, param);
      }
    }
  }

}
