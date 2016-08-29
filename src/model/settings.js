import {Events} from 'tabris';
import {mixin} from './helpers';

const store = {};

class Settings {

  get serverUrl() {
    return store.serverUrl;
  }

  set serverUrl(url) {
    store.serverUrl = url;
    localStorage.setItem('serverUrl', url);
    this.trigger('change:serverUrl');
  }

  load() {
    store.serverUrl = localStorage.getItem('serverUrl') || 'http://192.168.1.1';
  }

}

mixin(Settings, Events);

export default new Settings();
