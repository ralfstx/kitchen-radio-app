/* globals fetch: false, Promise: true*/

Promise = require("promise");
require("whatwg-fetch");

let _ = require("underscore");
let config = require("./config");
let AlbumPage = require("./album-page");

exports.create = function() {

  let page = new tabris.Page({
    title: "Collection",
    topLevel: true
  });

  let filterInput = new tabris.TextInput({
    layoutData: {left: 0, right: 0, top: 0},
    message: "filter"
  }).on("change:text", showAlbums).appendTo(page);

  let albumsList = new tabris.CollectionView({
    layoutData: {left: 0, right: 0, top: [filterInput, 0], bottom: 0},
    itemHeight: 60,
    initializeCell: cell => {
      let iconView = new tabris.ImageView({
        layoutData: {left: 0, top: 0, width: 60, height: 60},
        scaleMode: "fill"
      }).appendTo(cell);
      let nameView = new tabris.TextView({
        layoutData: {left: 80, right: 10, top: 5, bottom: 5},
        textColor: "rgb(74, 74, 74)"
      }).appendTo(cell);
      cell.on("change:item", (view, album) => {
        iconView.set("image", getCoverImage(album));
        nameView.set("text", album.name);
      });
    }
  }).on("select", (widget, item) => {
    AlbumPage.create(item).open();
  }).appendTo(page);

  let albums;

  fetch(config.server + "/files/albums").then(resp => resp.json()).then(result => {
    albums = result;
    showAlbums();
  });

  function getCoverImage(album) {
    return {src: config.server + "/files/albums/" + album.path + "/cover-250.jpg", width: 250, height: 250};
  }

  function showAlbums() {
    let filter = filterInput.get("text");
    if (filter) {
      let match = album => (album.name || "").toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      albumsList.set("items", albums.filter(match));
    } else {
      albumsList.set("items", _.shuffle(albums));
    }
  }

};
