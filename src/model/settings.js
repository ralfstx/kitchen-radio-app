import Events from '../lib/Events';
import {localStorage} from 'tabris';

const store = {};

class Settings extends Events {

  get serverUrl() {
    return store.serverUrl;
  }

  set serverUrl(url) {
    store.serverUrl = url;
    localStorage.setItem('serverUrl', url);
    this.trigger('serverUrlChanged');
  }

  load() {
    store.serverUrl = localStorage.getItem('serverUrl') || 'http://192.168.1.1';
  }

}

export default new Settings();
