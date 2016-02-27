import player from "../model/player";
import { Page, Button, TextView, Slider, CollectionView } from "tabris";

export default class PlayerPage extends Page {

  constructor() {
    super({
      title: "Player",
      topLevel: true
    });
    createButton(player.prev, "<<").appendTo(this);
    createButton(player.pause, "||").appendTo(this);
    createButton(player.next, ">>").appendTo(this);

    new Button({
      layoutData: {top: 0, left: "prev()"},
      text: "refresh"
    }).on("select", () => {
      this.updateStatus();
    }).appendTo(this);

    this._statusView = new TextView({
      layoutData: {left: 0, right: 0, top: "prev()"},
      text: "..."
    }).appendTo(this);

    this._slider = new Slider({
      layoutData: {left: 0, right: 0, top: ["prev()", 5]},
      maximum: 1000
    }).appendTo(this);

    this._playlistList = new CollectionView({
      layoutData: {left: 0, right: 0, top: ["prev()", 5], bottom: 0},
      itemHeight: 60,
      initializeCell: cell => {
        let nameView = new TextView({
          layoutData: {left: 10, right: 100, top: 5, bottom: 5},
          textColor: "rgb(74, 74, 74)"
        }).appendTo(cell);
        let timeView = new TextView({
          layoutData: {right: 10, top: 5, bottom: 5, width: 80},
          textColor: "rgb(74, 74, 74)",
          alignment: "right"
        }).appendTo(cell);
        cell.on("change:item", (view, item) => {
          nameView.set("text", item.name);
          timeView.set("text", formatTime(item.time));
        });
      }
    }).appendTo(this);
    this.updateStatus();
  }

  updateStatus() {
    player.status().then(status => {
      this._statusView.set("text", status.state);
      if (status.time) {
        let times = status.time.split(':');
        let total = parseInt(times[1]);
        let elapsed = parseInt(times[0]);
        if (Number.isFinite(total) && Number.isFinite(elapsed)) {
          this._slider.set({maximum: total, selection: elapsed});
        }
      }
      if (status.playlist !== this._playlist) {
        this._updatePlaylist();
        this._playlist = status.playlist;
      } else if (status.song !== this._song) {
        this._updateSong();
        this._song = status.song;
      }
    });
  }

  _updatePlaylist() {
    player.playlist().then(playlist => {
      this._playlistList.set("items", playlist);
    });
  }

  _updateSong() {
  }

}

function createButton(cmd, text) {
  return new Button({
    layoutData: {top: 0, left: "prev()"},
    text: text
  }).on("select", cmd);
}

function formatTime(seconds) {
  if (!seconds) {
    return "";
  }
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  return min + (sec < 10 ? ":0" : ":") + sec;
}

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
