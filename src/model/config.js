import { Events } from "tabris";

const store = {};

function Settings() {
}

Settings.prototype = {

  get serverUrl() {
    return store.serverUrl;
  },

  set serverUrl(url) {
    store.serverUrl = url;
    localStorage.setItem("serverUrl", url);
    this.trigger("change:serverUrl");
  },

  load() {
    store.serverUrl = localStorage.getItem("serverUrl") || "http://192.168.1.";
  }

};

Object.assign(Settings.prototype, Events);

export default new Settings();
