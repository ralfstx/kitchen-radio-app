import player from "../model/player";
import { formatTime } from "../model/helpers";
import { Page, Button, TextView, ImageView, CollectionView, ui } from "tabris";

export default class AlbumPage extends Page {

  constructor() {
    super();
    this.on("change:bounds", () => {
      this.layout();
    });
    this.on('appear', () => {
      ui.set('toolbarVisible', true);
    }).on('disappear', () => {
      ui.set('toolbarVisible', false);
    });
    let coverSize = Math.min(screen.width, screen.height);
    this._trackListView = new CollectionView({
      itemHeight: item => item.type === "album" ? coverSize : 50,
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
  }

  set album(album) {
    this._album = album;
    this.update();
  }

  get album() {
    return this._album || null;
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

function createAlbumCell(cell) {
  let coverView = new ImageView({
    left: 0, right: 0, top: 0, bottom: 0,
    scaleMode: "fit"
  }).appendTo(cell);
  new Button({
    right: 50, bottom: 50,
    text: "play",
  }).on("select", () => {
    let album = cell.get("item");
    player.play(album.tracks);
  }).appendTo(cell);
  cell.on("change:item", (cell, album) => {
    coverView.set("image", {src: album.url + "/cover-250.jpg", width: 250, height: 250});
  });
}

function createTrackCell(cell) {
  let numberView = new TextView({
    left: 8, width: 32, top: 4, bottom: 4,
    alignment: "right",
    opacity: 0.25,
    font: "16px sans-serif"
  }).appendTo(cell);
  let titleView = new TextView({
    left: 48, right: 84, top: 4, bottom: 4,
    font: "16px sans-serif"
  }).appendTo(cell);
  let timeView = new TextView({
    right: 16, width: 72, top: 4, bottom: 4,
    alignment: "right",
    font: "16px sans-serif"
  }).appendTo(cell);
  cell.on("change:item", (cell, track) => {
    numberView.set("text", track.number);
    titleView.set("text", track.title || track.path);
    timeView.set("text", formatTime(track.length));
  }).on("tap", () => {
    let track = cell.get("item");
    let tracks = track.album.tracks;
    let index = tracks.indexOf(track);
    player.play(tracks.slice(index));
  }).on("swipe:left", () => {
    let track = cell.get("item");
    player.play([track]);
  }).on("swipe:right", () => {
    let track = cell.get("item");
    player.append([track]);
  });
}

function createSectionCell(cell) {
  let textView = new TextView({
    left: 45, right: 85, top: 5, bottom: 5,
    font: "bold 18px sans-serif"
  }).appendTo(cell);
  cell.on("change:item", (view, disc) => {
    textView.set("text", "Disc " + disc.number);
  });
}

function getItems(album) {
  let items = [];
  album.type = "album";
  items.push(album);
  album.discs.forEach(disc => {
    if (album.discs.length > 1) {
      disc.type = "disc";
      items.push(disc);
    }
    disc.tracks.forEach(track => {
      track.type = "track";
      items.push(track);
    });
  });
  return items;
}
