import settings from './settings';
import {Album} from './album';
import {fetch} from '../lib/fetch';

export function loadStations() {
  return get('/stations')
    .then(rsp => rsp.json())
    .then(stations => stations.map(station => Object.assign(station, {
      url: station.stream,
      iconUrl: settings.serverUrl + '/stations/' + station.id + '/image'
    })));
}

export function loadAlbums() {
  return get('/albums')
    .then(resp => resp.json())
    .catch(() => []);
}

export function search(term) {
  return get('/albums/search?q=' + encodeURIComponent(term))
    .then(resp => resp.json())
    .catch(() => []);
}

export function getCoverUrl(album, size) {
  let url = settings.serverUrl + '/albums/' + album.id + '/cover';
  return size ? url + '?size=' + size : url;
}

export function loadAlbum(id) {
  return get('/albums/' + id)
    .then(resp => resp.json())
    .then(data => new Album('/albums/' + id, Object.assign({id}, data)))
    .catch(() => null);
}

export function shutdown() {
  return get('/shutdown');
}

function get(path) {
  let url = settings.serverUrl + path;
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: GET ${url}`);
    }
    return res;
  }).catch(err => {
    console.error(err.stack || err);
    throw err;
  });
}
