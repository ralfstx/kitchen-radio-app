/* globals fetch: false, Promise: true*/

Promise = require("promise");
require("whatwg-fetch");

let config = require("./config");

exports.create = function() {

  let page = new tabris.Page({
    title: "Player",
    topLevel: true
  });

  createButton("prev", "<<").appendTo(page);
  createButton("pause", "||").appendTo(page);
  createButton("next", ">>").appendTo(page);

  function createButton(cmd, text) {
    return new tabris.Button({
      layoutData: {top: 0, left: "prev()"},
      text: text
    }).on("select", () => {
      fetch(config.server + "/" + cmd);
    });
  }

  new tabris.Button({
    layoutData: {top: 0, left: "prev()"},
    text: "refresh"
  }).on("select", () => {
    updateStatus();
  }).appendTo(page);

  let statusView = new tabris.TextView({
    layoutData: {left: 0, right: 0, top: "prev()"},
    text: "..."
  }).appendTo(page);

  let slider = new tabris.Slider({
    layoutData: {left: 0, right: 0, top: ["prev()", 5]},
    maximum: 1000
  }).appendTo(page);

  let playlistList = new tabris.CollectionView({
    layoutData: {left: 0, right: 0, top: [slider, 5], bottom: 0},
    itemHeight: 60,
    initializeCell: cell => {
      let nameView = new tabris.TextView({
        layoutData: {left: 10, right: 100, top: 5, bottom: 5},
        textColor: "rgb(74, 74, 74)"
      }).appendTo(cell);
      let timeView = new tabris.TextView({
        layoutData: {right: 10, top: 5, bottom: 5, width: 80},
        textColor: "rgb(74, 74, 74)",
        background: "yellow",
        alignment: "right"
      }).appendTo(cell);
      cell.on("change:item", (view, item) => {
        nameView.set("text", item.name);
        timeView.set("text", item.time);
      });
    }
  }).appendTo(page);

  let playlist;
  let song;

  updateStatus();

  function updateStatus() {
    fetch(config.server + "/status").then(rsp => rsp.json()).then(status => {
      statusView.set("text", status.state);
      if (status.time) {
        let times = status.time.split(':');
        let total = parseInt(times[1]);
        let elapsed = parseInt(times[0]);
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
    fetch(config.server + "/playlist").then(rsp => rsp.json()).then(playlist => {
      playlistList.set("items", playlist.map((item, index) => ({
        name: item.Name || item.Title || index.toString(),
        time: formatTime(item.Time)
      })));
    });
  }

  function updateSong() {
  }

  function formatTime(seconds) {
    if (!seconds) {
      return "";
    }
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
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
