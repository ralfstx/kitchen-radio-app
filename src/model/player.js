import settings from './settings';
import {mixin} from './helpers';
import {Events} from 'tabris';

class Player {

  play(tracks) {
    if (Array.isArray(tracks)) {
      return post('replace', tracks.map(track => track.url))
        .then(() => this.status());
    }
    return get('play/' + tracks.url)
      .then(() => this.status());
  }

  append(tracks) {
    return post('append', tracks.map(track => track.url))
      .then(() => this.status());
  }

  pause() {
    get('pause')
      .then(() => this.status());
  }

  next() {
    get('next')
      .then(() => this.status());
  }

  prev() {
    get('prev')
      .then(() => this.status());
  }

  stop() {
    get('stop')
      .then(() => this.status());
  }

  status() {
    return get('status')
      .then(rsp => rsp.json())
      .then(status => this._processStatus(status));
  }

  playlist() {
    return get('playlist')
      .then(rsp => rsp.json())
      .then(playlist => this._processPlaylist(playlist));
  }

  _processStatus(status) {
    if (status.playlist !== this._playlistid) {
      this.playlist();
      this._playlistid = status.playlist;
    }
    if (status.songid !== this._songid) {
      //this._updateSong();
      this._songid = status.song;
    }
    let result = {
      state: status.state,
      elapsedTime: parseInt(status.elapsed)
    };
    if (status.time) {
      let times = status.time.split(':');
      let total = parseInt(times[1]);
      let elapsed = parseInt(times[0]);
      if (Number.isFinite(total) && Number.isFinite(elapsed)) {
        result.totalTime = total;
        result.elapsedTime = elapsed;
      }
    }
    this.trigger('status', result);
    return result;
  }

  _processPlaylist(playlist) {
    let result = playlist.map((item, index) => ({
      name: item.Name || item.Title || 'Track ' + (index + 1),
      time: item.Time
    }));
    this.trigger('playlist', result);
    return result;
  }

}

mixin(Player, Events);

export default new Player();

function get(path) {
  return fetch(settings.serverUrl + '/' + path, {
    headers: {
      'Accept': 'application/json'
    }
  });
}

function post(cmd, body) {
  return fetch(settings.serverUrl + '/' + cmd, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
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
