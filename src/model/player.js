import settings from "./settings";

function get(path) {
  return fetch(settings.serverUrl + '/' + path, {
    headers: {
      'Accept': 'application/json'
    }
  });
}

function post(cmd, body) {
  return fetch(settings.serverUrl + '/' + cmd, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

export default {

  play(tracks) {
    if (Array.isArray(tracks)) {
      return post("replace", tracks.map(track => track.url));
    }
    return get("play/" + tracks.url);
  },

  append(tracks) {
    return post("append", tracks.map(track => track.url));
  },

  pause() {
    get("/pause");
  },

  next() {
    get("/next");
  },

  prev() {
    get("/prev");
  },

  stop() {
    get("/stop");
  },

  playlist() {
    return get("/playlist")
      .then(rsp => rsp.json())
      .then(playlist => playlist.map((item, index) => ({
        name: item.Name || item.Title || 'Track ' + (index + 1),
        time: item.Time
      })));
  },

  status() {
    return get("/status")
      .then(rsp => rsp.json());
  }

};
