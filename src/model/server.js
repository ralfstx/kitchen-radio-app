import settings from './settings';
import {Album} from './album';
import {fetch} from '../lib/fetch';

export function loadStations() {
  return get('/files/stations')
    .then(rsp => rsp.json())
    .then(stations => stations.map(station => ({
      name: station.name,
      www: station.www,
      url: station.stream,
      iconUrl: settings.serverUrl + '/files/stations/' + station.icon
    })));
}

export function loadAlbums() {
  return get('/files/albums')
    .then(resp => resp.json())
    .then(albums => albums.map(album => {
      album.coverUrl = settings.serverUrl + '/files/albums/' + album.path + '/cover-100.jpg';
      return album;
    }));
}

export function loadAlbum(path) {
  return get('/files/albums/' + path)
    .then(resp => resp.json())
    .then(data => new Album(settings.serverUrl + '/files/albums/' + path, data));
}

function get(path) {
  return fetch(settings.serverUrl + path, {
    headers: {
      'Accept': 'application/json'
    }
  }).catch(err => {
    console.error(err);
  });
}
