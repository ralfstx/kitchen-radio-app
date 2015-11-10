/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");
var _ = require("underscore");
var config = require("./config");

exports.create = function(album) {

  var page = tabris.create("Page", {
    title: album.name
  }).on("change:bounds", layout);

  var coverView = tabris.create("ImageView", {
    scaleMode: "fill"
  }).appendTo(page);

  var trackListView = tabris.create("CollectionView", {
    itemHeight: 35,
    initializeCell: function(cell) {
      var numberView = tabris.create("TextView", {
        layoutData: {left: 10, width: 30, top: 5, bottom: 5},
        font: "15px sans-serif",
        alignment: "right"
      }).appendTo(cell);
      var titleView = tabris.create("TextView", {
        layoutData: {left: 45, right: 85, top: 5, bottom: 5},
        font: "15px sans-serif"
      }).appendTo(cell);
      var timeView = tabris.create("TextView", {
        layoutData: {right: 10, width: 70, top: 5, bottom: 5},
        font: "15px sans-serif",
        alignment: "right"
      }).appendTo(cell);
      cell.on("change:item", function(view, item) {
        if (item.type === "track") {
          numberView.set("text", item.number + ".");
          titleView.set("text", item.title || item.path);
          titleView.set("font", "15px sans-serif");
        } else {
          numberView.set("text", "");
          var isMulti = item.album.discs.length > 1;
          titleView.set("text", isMulti ? "Disc " + item.number : "");
          titleView.set("font", "bold 18px sans-serif");
        }
        timeView.set("text", formatLength(item.length));
      });
    }
  }).on("select", function(widget, item) {
    if (item.type === "track") {
      play([item]);
    } else {
      play(item.tracks);
    }
  }).appendTo(page);

  var playButton = tabris.create("Button", {
    text: "play album",
  }).on("select", function() {
    play(getTracks());
  }).appendTo(page);

  fetch(config.server + "/files/albums/" + album.path + "/").then(function(response) {
    return response.json();
  }).then(function(result) {
    _.extend(album, result);
    update();
  });

  function update() {
    page.set("title", album.name || "unknown album");
    coverView.set("image", getCoverImage());
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

  function getCoverImage() {
    return {src: config.server + "/files/albums/" + album.path + "/cover-250.jpg", width: 250, height: 250};
  }

  function getTrackUrl(track) {
    function notEmpty(value) { return !!value; }
    var parts = [album.path, track.disc && track.disc !== track.album ? track.disc.path : "", track.path];
    return config.server + "/files/albums/" + parts.filter(notEmpty).map(encodeURIComponent).join("/");
  }

  function getItems() {
    var items = [];
    if (album) {
      album.discs = album.discs || [album];
      album.discs.forEach(function(disc, index) {
        disc.album = album;
        disc.number = index + 1;
        disc.type = "disc";
        items.push(disc);
        if (disc.tracks) {
          disc.tracks.forEach(function(track, index) {
            track.album = album;
            track.disc = disc;
            track.number = index + 1;
            track.type = "track";
          });
          items = items.concat(disc.ttrackListViewracks);
        }
      });
    }
    return items;
  }

  function getTracks() {
    return getItems().filter(function(item) {
      return item.type === "track";
    });
  }

  function layout() {
    var bounds = page.get("bounds");
    var coverSize = Math.floor(bounds.width / 3);
    if (bounds.width > bounds.height) {
      // landscape
      trackListView.set("layoutData", {left: 0, top: 0, bottom: 0, right: [33, 5]});
      playButton.set("layoutData", {right: 20, top: 20});
      coverView.set("layoutData", {right: 0, bottom: 0, width: coverSize, height: coverSize});
    } else {
       // portrait
      coverView.set("layoutData", {left: 0, top: 0, width: coverSize, height: coverSize});
      playButton.set("layoutData", {right: 20, top: 20});
      trackListView.set("layoutData", {left: 0, top: coverSize, right: 0, bottom: 0});
    }
  }

  function formatLength(seconds) {
    if (!seconds) {
      return "";
    }
    function pad(n) {
      return n < 10 ? "0" + n : "" + n;
    }
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds - (m * 60));
    return m + ":" + pad(s);
  }

  return page;

};
