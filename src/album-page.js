/* globals fetch: false, Promise: true*/

Promise = require("promise");
require("whatwg-fetch");

let _ = require("underscore");
let config = require("./config");

exports.create = function(album) {

  let page = new tabris.Page({
    title: album.name
  }).on("change:bounds", layout);

  let trackListView = new tabris.CollectionView({
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
  }).appendTo(page);

  function createAlbumCell(parent) {
    let coverView = new tabris.ImageView({
      left: 0, right: 0, top: 0, bottom: 0,
      scaleMode: "fit"
    }).appendTo(parent);
    new tabris.Button({
      right: 50, bottom: 50,
      text: "play",
    }).on("select", () => {
      play(getTracks());
    }).appendTo(parent);
    parent.on("change:item", () => {
      coverView.set("image", getCoverImage());
    });
  }

  function createTrackCell(parent) {
    let titleView = new tabris.TextView({
      left: 45, right: 85, top: 5, bottom: 5,
      font: "15px sans-serif"
    }).appendTo(parent);
    let timeView = new tabris.TextView({
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
    let textView = new tabris.TextView({
      left: 45, right: 85, top: 5, bottom: 5,
      font: "bold 18px sans-serif"
    }).appendTo(parent);
    parent.on("change:item", (view, disc) => {
      textView.set("text", "Disc " + disc.number);
    });
  }

  fetch(config.server + "/files/albums/" + album.path + "/").then(rsp => rsp.json()).then(result => {
    _.extend(album, result);
    update();
  });

  function update() {
    page.set("title", album.name || "unknown album");
    trackListView.set("items", getItems());
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

  function getCoverImage() {
    return {src: config.server + "/files/albums/" + album.path + "/cover-250.jpg", width: 250, height: 250};
  }

  function getTrackUrl(track) {
    let notEmpty = value => !!value;
    let parts = [album.path, track.disc ? track.disc.path : "", track.path];
    return config.server + "/files/albums/" + parts.filter(notEmpty).map(encodeURIComponent).join("/");
  }

  function getItems() {
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

  function getTracks() {
    return getItems().filter(item => item.type === "track");
  }

  function layout() {
    let bounds = page.get("bounds");
    if (bounds.width > bounds.height) {
      // landscape
      trackListView.set("layoutData", {left: 0, top: 0, bottom: 0, right: 0});
    } else {
       // portrait
      trackListView.set("layoutData", {left: 0, top: 0, right: 0, bottom: 0});
    }
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

  return page;

};
