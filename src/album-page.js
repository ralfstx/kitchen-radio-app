import _ from "underscore";
import config from "./config";
import { Page, Button, TextView, ImageView, CollectionView } from "tabris";

export default class AlbumPage extends Page {

  constructor(album) {
    super({
      title: album.name
    });
    this._album = album;
    this.on("change:bounds", () => {
      this.layout();
    });

    this._trackListView = new CollectionView({
      itemHeight: item => item.type === "album" ? 500 : 50,
      cellType: item => item.type,
      initializeCell: (cell, type) => {
        if (type === "album") {
          return createAlbumCell(cell);
        } else if (type === "track") {
          return createTrackCell(cell);
        } else {
          return createSectionCell(cell);
        }
      }
    }).appendTo(this);
    this.load();
  }

  load() {
    let path = config.server + "/files/albums/" + this._album.path + "/";
    fetch(path).then(rsp => rsp.json()).then(result => {
      _.extend(this._album, result);
      this.update();
    });
  }

  update() {
    this.set("title", this._album.name || "unknown album");
    this._trackListView.set("items", getItems(this._album));
  }

  layout() {
    let bounds = this.get("bounds");
    if (bounds.width > bounds.height) {
      // landscape
      this._trackListView.set("layoutData", {left: 0, top: 0, bottom: 0, right: 0});
    } else {
       // portrait
      this._trackListView.set("layoutData", {left: 0, top: 0, right: 0, bottom: 0});
    }
  }

}

function createAlbumCell(parent) {
  let coverView = new ImageView({
    left: 0, right: 0, top: 0, bottom: 0,
    scaleMode: "fit"
  }).appendTo(parent);
  new Button({
    right: 50, bottom: 50,
    text: "play",
  }).on("select", (cell) => {
    play(getTracks(cell.get("item")));
  }).appendTo(parent);
  parent.on("change:item", (cell, album) => {
    coverView.set("image", getCoverImage(album));
  });
}

function createTrackCell(parent) {
  let titleView = new TextView({
    left: 45, right: 85, top: 5, bottom: 5,
    font: "15px sans-serif"
  }).appendTo(parent);
  let timeView = new TextView({
    right: 10, width: 70, top: 5, bottom: 5,
    font: "15px sans-serif",
    alignment: "right"
  }).appendTo(parent);
  parent.on("change:item", (view, track) => {
    titleView.set("text", track.title || track.path);
    timeView.set("text", formatLength(track.length));
  }).on("swipe:left", () => {
    let track = parent.get("item");
    play([track]);
  }).on("swipe:right", () => {
    let track = parent.get("item");
    append([track]);
  });
}

function createSectionCell(parent) {
  let textView = new TextView({
    left: 45, right: 85, top: 5, bottom: 5,
    font: "bold 18px sans-serif"
  }).appendTo(parent);
  parent.on("change:item", (view, disc) => {
    textView.set("text", "Disc " + disc.number);
  });
}

function play(tracks) {
  fetch(config.server + "/replace", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tracks.map(getTrackUrl))
  });
}

function append(tracks) {
  fetch(config.server + "/append", {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tracks.map(getTrackUrl))
  });
}

function getCoverImage(album) {
  return {src: config.server + "/files/albums/" + album.path + "/cover-250.jpg", width: 250, height: 250};
}

function getTrackUrl(track) {
  let notEmpty = value => !!value;
  let parts = [track.album.path, track.disc ? track.disc.path : "", track.path];
  return config.server + "/files/albums/" + parts.filter(notEmpty).map(encodeURIComponent).join("/");
}

function getItems(album) {
  let items = [];
  if (album) {
    album.type = "album";
    items.push(album);
    if ("discs" in album) {
      album.discs.forEach((disc, index) => {
        disc.album = album;
        disc.number = index + 1;
        disc.type = "disc";
        items.push(disc);
        if ("tracks" in disc) {
          disc.tracks.forEach((track, index) => {
            track.album = album;
            track.disc = disc;
            track.number = index + 1;
            track.type = "track";
            items.push(track);
          });
        }
      });
    }
    if ("tracks" in album) {
      album.tracks.forEach((track, index) => {
        track.album = album;
        track.number = index + 1;
        track.type = "track";
        items.push(track);
      });
    }
  }
  return items;
}

function getTracks(album) {
  return getItems(album).filter(item => item.type === "track");
}

function formatLength(seconds) {
  if (!seconds) {
    return "";
  }
  let pad = n => n < 10 ? "0" + n : "" + n;
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds - (m * 60));
  return m + ":" + pad(s);
}
