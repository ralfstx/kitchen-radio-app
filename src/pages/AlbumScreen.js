import {player} from '../model/Player';
import {getCoverUrl} from '../model/server';
import {getImage} from '../model/images';
import {formatTime} from '../model/helpers';
import {Composite, TextView, ImageView, CollectionView, app} from 'tabris';

export default class AlbumScreen extends Composite {

  constructor(properties) {
    super(Object.assign({background: 'white'}, properties));
    this.on('change:bounds', () => {
      this.layout();
    });
    let coverSize = Math.min(screen.width, screen.height);
    this._trackListView = new CollectionView({
      itemHeight: item => item.type === 'album' ? coverSize : 50,
      cellType: item => item.type,
      initializeCell: (cell, type) => {
        if (type === 'album') {
          return this._createAlbumCell(cell);
        }
        if (type === 'track') {
          return this._createTrackCell(cell);
        }
        return this._createSectionCell(cell);
      }
    }).appendTo(this);
    this._listenOnBackNavigation();
  }

  set album(album) {
    this._album = album;
    this.update();
  }

  get album() {
    return this._album || null;
  }

  update() {
    this.title = this._album.name || 'unknown album';
    this._trackListView.items = getItems(this._album);
  }

  layout() {
    let bounds = this.bounds;
    if (bounds.width > bounds.height) {
      // landscape
      this._trackListView.layoutData = {left: 0, top: 0, bottom: 0, right: 0};
    } else {
       // portrait
      this._trackListView.layoutData = {left: 0, top: 0, right: 0, bottom: 0};
    }
  }

  close() {
    this.animate({
      transform: {translationY: this.bounds.height}
    }, {
      duration: 150,
      easing: 'ease-out'
    }).then(() => this.dispose());
  }

  _createAlbumCell(cell) {
    let coverView = new ImageView({
      left: 0, right: 0, top: 0, bottom: 0,
      scaleMode: 'fit'
    }).appendTo(cell);
    new ImageView({
      right: 50, bottom: 50, width: 50, height: 50, cornerRadius: 25,
      background: 'rgba(45, 163, 47, 0.75)',
      elevation: 4,
      image: getImage('play_circle_filled_black_48dp')
    }).on('tap', () => {
      let album = cell.item;
      player.play(album.tracks);
    }).appendTo(cell);
    cell.on('change:item', ({value: album}) => {
      coverView.image = {src: getCoverUrl(album), width: 250, height: 250};
    });
  }

  _createTrackCell(cell) {
    let numberView = new TextView({
      left: 8, width: 32, top: 4, bottom: 4,
      alignment: 'right',
      opacity: 0.25,
      font: '16px sans-serif'
    }).appendTo(cell);
    let titleView = new TextView({
      left: 48, right: 84, top: 4, bottom: 4,
      font: '16px sans-serif'
    }).appendTo(cell);
    let timeView = new TextView({
      right: 16, width: 72, top: 4, bottom: 4,
      alignment: 'right',
      font: '16px sans-serif'
    }).appendTo(cell);
    cell.on('change:item', ({value: track}) => {
      numberView.text = track.number;
      titleView.text = track.title;
      timeView.text = formatTime(track.length);
    }).on('tap', () => {
      let track = cell.item;
      let tracks = track.album.tracks;
      let index = tracks.indexOf(track);
      player.play(tracks.slice(index));
    }).on('swipe:left', () => {
      let track = cell.item;
      player.play([track]);
    }).on('swipe:right', () => {
      let track = cell.item;
      player.append([track]);
    });
  }

  _createSectionCell(cell) {
    let textView = new TextView({
      left: 45, right: 85, top: 5, bottom: 5,
      font: 'bold 18px sans-serif'
    }).appendTo(cell);
    cell.on('change:item', ({value: disc}) => {
      textView.text = 'Disc ' + disc.number;
    });
  }

  _listenOnBackNavigation() {
    let listener = (event) => {
      event.preventDefault();
      this.close();
    };
    app.on('backnavigation', listener);
    this.on('dispose', () => app.off('backnavigation', listener));
  }

}

function getItems(album) {
  let items = [];
  album.type = 'album';
  items.push(album);
  album.discs.forEach(disc => {
    if (album.discs.length > 1) {
      disc.type = 'disc';
      items.push(disc);
    }
    disc.tracks.forEach(track => {
      track.type = 'track';
      items.push(track);
    });
  });
  return items;
}
