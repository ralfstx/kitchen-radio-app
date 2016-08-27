
export class Track {

  constructor(disc, data) {
    this.disc = disc;
    this.path  = data.path || '';
    this.title  = data.title || '';
    this.artist = data.artist || '';
    this.length = data.length || 0;
  }

  get number() {
    return this.disc ? this.disc.tracks.indexOf(this) + 1 : 0;
  }

  get album() {
    return this.disc ? this.disc.album : null;
  }

  get url() {
    return this.disc ? this.path ? this.disc.url + '/' + encodeURIComponent(this.path) : this.disc.url : '';
  }

}

export class Disc {

  constructor(album, data = {}) {
    this.album = album;
    this.path  = data.path || '';
    this.title  = data.title || '';
    this.artist = data.artist || '';
    this.tracks = data.tracks ? data.tracks.map(track => new Track(this, track)) : [];
  }

  get number() {
    return this.album ? this.album.discs.indexOf(this) + 1 : 0;
  }

  get url() {
    return this.album ? this.path ? this.album.url + '/' + encodeURIComponent(this.path) : this.album.url : '';
  }

}

export class Album {

  constructor(url, data = {}) {
    if (!url) throw new Error('Album url missing');
    this.url = url;
    this.name = data.name;
    this.title  = data.title || '';
    this.artist = data.artist || '';
    this.discs = [];
    if (data.tracks) {
      this.discs.push(new Disc(this, {tracks: data.tracks}));
    }
    if (data.discs) {
      data.discs.forEach(disc => {
        this.discs.push(new Disc(this, disc));
      });
    }
  }

  get tracks() {
    return this.discs.reduce((tracks, disc) => tracks.concat(disc.tracks), []);
  }

  get coverUrl() {
    return this.url + '/cover-250.jpg';
  }

}
