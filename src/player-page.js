/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");
var config = require("./config");

exports.create = function() {

  var page = new tabris.Page({
    title: "Player",
    topLevel: true
  });

  createButton("play").appendTo(page);
  createButton("pause").appendTo(page);
  createButton("stop").appendTo(page);
  createButton("prev").appendTo(page);
  createButton("next").appendTo(page);

  var lastButton;
  function createButton(cmd) {
    var button = new tabris.Button({
      layoutData: {top: 0, left: lastButton ? [lastButton, 0] : 0},
      text: cmd
    }).on("select", function() {
      fetch(config.server + "/" + cmd);
    });
    lastButton = button;
    return button;
  }

  new tabris.Button({
    layoutData: {top: 0, left: lastButton ? [lastButton, 0] : 0},
    text: "refresh"
  }).on("select", function() {
    updateStatus();
  }).appendTo(page);

  var statusView = new tabris.TextView({
    layoutData: {left: 0, right: 0, top: [lastButton, 5]},
    text: "..."
  }).appendTo(page);

  var slider = new tabris.Slider({
    layoutData: {left: 0, right: 0, top: [statusView, 5]},
    maximum: 1000
  }).appendTo(page);

  var playlistList = new tabris.CollectionView({
    layoutData: {left: 0, right: 0, top: [slider, 5], bottom: 0},
    itemHeight: 60,
    initializeCell: function(cell) {
      var nameView = new tabris.TextView({
        layoutData: {left: 10, right: 100, top: 5, bottom: 5},
        textColor: "rgb(74, 74, 74)"
      }).appendTo(cell);
      var timeView = new tabris.TextView({
        layoutData: {right: 10, top: 5, bottom: 5, width: 80},
        textColor: "rgb(74, 74, 74)",
        background: "yellow",
        alignment: "right"
      }).appendTo(cell);
      cell.on("change:item", function(view, item) {
        nameView.set("text", item.name);
        timeView.set("text", item.time);
      });
    }
  }).appendTo(page);

  var playlist;
  var song;

  updateStatus();

  function updateStatus() {
    fetch(config.server + "/status").then(function(response) {
      return response.json();
    }).then(function(status) {
      statusView.set("text", status.state);
      if (status.time) {
        var times = status.time.split(':');
        var total = parseInt(times[1]);
        var elapsed = parseInt(times[0]);
        if (Number.isFinite(total) && Number.isFinite(elapsed)) {
          slider.set({maximum: total, selection: elapsed});
        }
      }
      if (status.playlist !== playlist) {
        updatePlaylist();
        playlist = status.playlist;
      } else if (status.song !== song) {
        updateSong();
        song = status.song;
      }
    });
  }

  function updatePlaylist() {
    fetch(config.server + "/playlist").then(function(response) {
      return response.json();
    }).then(function(playlist) {
      playlistList.set("items", playlist.map(function(item, index) {
        return {
          name: item.Name || item.Title || index.toString(),
          time: formatTime(item.Time)
        };
      }));
    });
  }

  function updateSong() {
  }

  function formatTime(seconds) {
    if (!seconds) {
      return "";
    }
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return min + (sec < 10 ? ":0" : ":") + sec;
  }

  return page;

};

/*

status
------
volume: -1
repeat: 0
random: 0
single: 0
consume: 0
playlist: 215
playlistlength: 5
mixrampdb: 0.000000
state: play
song: 4
songid: 115
time: 683:0
elapsed: 683.491
bitrate: 105
audio: 44100:f:2

playlistinfo
------------
file: http://192.168.5.5:8080/albums/pink-floyd-wish-you-were-here/01-shine-on-you-crazy-diamond-part-one.ogg
Title: Shine On You Crazy Diamond (Part One)
Artist: Pink Floyd
Genre: Rock
Date: 1975
Album: Wish You Were Here
Track: 01
Pos: 0
Id: 117
file: http://192.168.5.5:8080/albums/pink-floyd-wish-you-were-here/02-welcome-to-the-machine.ogg
Time: 447
Name: Pink Floyd - Welcome To The Machine
Pos: 1
Id: 118
...
OK

playlistinfo
------------
file: http://192.168.5.5:8080/albums/orchestra-baobab-a-night-at-club-baobab/01.ogg
Artist: Orchestra Baobab
Album: A Night at Club Baobab
Title: Jin ma jin ma
Pos: 0
Id: 122
file: http://192.168.5.5:8080/albums/orchestra-baobab-a-night-at-club-baobab/02.ogg
Pos: 1
Id: 123
file: http://192.168.5.5:8080/albums/orchestra-baobab-a-night-at-club-baobab/03.ogg
Pos: 2
Id: 124
...
OK

*/
