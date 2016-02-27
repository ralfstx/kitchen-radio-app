import config from "../config";

export default {

  play(tracks) {
    fetch(config.server + "/replace", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tracks.map(track => track.url))
    });
  },

  append(tracks) {
    fetch(config.server + "/append", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tracks.map(track => track.url))
    });
  },

  pause() {
    fetch(config.server + "/pause");
  },

  next() {
    fetch(config.server + "/next");
  },

  prev() {
    fetch(config.server + "/prev");
  },

  stop() {
    fetch(config.server + "/stop");
  },

  playlist() {
    return fetch(config.server + "/playlist")
      .then(rsp => rsp.json())
      .then(playlist => playlist.map((item, index) => ({
        name: item.Name || item.Title || 'Track ' + (index + 1),
        time: item.Time
      })));
  },

  status() {
    return fetch(config.server + "/status")
      .then(rsp => rsp.json());
  }

};
