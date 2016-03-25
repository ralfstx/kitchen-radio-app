import settings from "./settings";
import { Album } from "./album";

export function loadStations() {
  return fetch(settings.serverUrl + "/files/stations")
    .then(rsp => rsp.json())
    .then(stations => stations.map(station => ({
      name: station.name,
      www: station.www,
      url: station.stream,
      iconUrl: settings.serverUrl + "/files/stations/" + station.icon
    })));
}

export function loadAlbums() {
  return fetch(settings.serverUrl + "/files/albums")
    .then(resp => resp.json())
    .then(albums => albums.map(album => {
      album.coverUrl = settings.serverUrl + "/files/albums/" + album.path + "/cover-100.jpg";
      return album;
    }));
}

export function loadAlbum(path) {
  let url = settings.serverUrl + "/files/albums/" + path;
  return fetch(url)
    .then(resp => resp.json())
    .then(data => new Album(url, data));
}
