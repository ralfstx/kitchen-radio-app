import Events from '../lib/Events';
import {isArray, isObject, isInteger} from '../lib/util';
import services from './services';

export default class Player extends Events {

  constructor() {
    super();
    this._status = {};
    this._playlist = [];
    services.wsClient.on('connected', () => this.update());
    services.wsClient.on('message:status', status => this._processStatus(status));
    services.wsClient.on('message:playlist', playlist => this._processPlaylist(playlist));
    this.update();
  }

  get status() {
    return this._status;
  }

  get playlist() {
    return this._playlist;
  }

  play(arg) {
    if (isArray(arg)) {
      services.wsClient.sendCmd('replace', arg.map(track => track.url));
    } else if (isObject(arg) && 'url' in arg) {
      services.wsClient.sendCmd('replace', [arg.url]);
    } else {
      services.wsClient.sendCmd('play', {pos: isInteger(arg) ? arg : 0});
    }
  }

  append(tracks) {
    services.wsClient.sendCmd('append', tracks.map(track => track.url));
  }

  remove(index) {
    services.wsClient.sendCmd('remove', {pos: index});
  }

  pause() {
    services.wsClient.sendCmd('pause');
  }

  skip(index) {
    services.wsClient.sendCmd('skip', index);
  }

  next() {
    services.wsClient.sendCmd('next');
  }

  prev() {
    services.wsClient.sendCmd('prev');
  }

  stop() {
    services.wsClient.sendCmd('stop');
  }

  update() {
    services.wsClient.sendCmd('status');
  }

  _updatePlaylist() {
    services.wsClient.sendCmd('playlist');
  }

  _processStatus(status) {
    if (status.playlist !== this._playlistid) {
      this._playlistid = status.playlist;
      this._updatePlaylist();
    }
    this._status = {
      state: status.state,
      track: parseInt(status.song),
      totalTracks: parseInt(status.playlistlength),
      elapsedTime: parseInt(status.elapsed || '0'),
    };
    this.trigger('change:status', this._status);
  }

  _processPlaylist(playlist) {
    this._playlist = playlist.map(processPlaylistItem);
    this.trigger('change:playlist', this._playlist);
  }

}

function processPlaylistItem(item) {
  let result = {name: item.name || ''};
  if (item.album) result.album = item.album;
  if ('disc' in item) result.disc = parseInt(item.disc);
  if ('track' in item) result.track = parseInt(item.track);
  if ('time' in item) result.time = parseInt(item.time);
  return result;
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
