import services from '../model/services';
import {getCoverUrl} from '../model/server';
import {getImage} from '../model/images';
import {formatTime} from '../model/helpers';
import {Cell, Composite, TextView, ImageView, CollectionView, app} from 'tabris';
import SelectableView from './SelectableView';

class AlbumCell extends Cell {

  constructor(properties) {
    super(properties);
    let coverView = new ImageView({
      left: 0, right: 0, top: 0, bottom: 0,
      scaleMode: 'fit'
    }).appendTo(this);
    new ImageView({
      right: 125, bottom: 50, width: 50, height: 50, cornerRadius: 25,
      elevation: 4,
      background: '#323246',
      image: getImage('play_arrow_white_36dp')
    }).on('tap', () => {
      services.player.play(this._getTracks());
    }).appendTo(this);
    new ImageView({
      right: 50, bottom: 50, width: 50, height: 50, cornerRadius: 25,
      elevation: 4,
      background: '#323246',
      image: getImage('playlist_add_white_36dp')
    }).on('tap', () => {
      services.player.append(this._getTracks());
    }).appendTo(this);
    this.on('itemChanged', ({value: album}) => {
      coverView.image = {src: getCoverUrl(album), width: 250, height: 250};
    });
  }

  _getTracks() {
    let album = this.item;
    let selected = album.tracks.filter(track => track.selected);
    return selected.length ? selected : album.tracks;
  }

}

class TrackView extends SelectableView {

  constructor(properties) {
    super(Object.assign({
      background: 'white'
    }, properties));
    this._createUI();
    this.on('selectedChanged', () => this.track ? this.track.selected = this.selected : null);
  }

  _createUI() {
    new TextView({
      id: 'numberView',
      left: 8, width: 32, top: 4, bottom: 4,
      alignment: 'right',
      opacity: 0.25,
      font: '16px sans-serif'
    }).appendTo(this);
    new TextView({
      id: 'titleView',
      left: 48, right: 84, top: 4, bottom: 4,
      font: '16px sans-serif'
    }).appendTo(this);
    new TextView({
      id: 'timeView',
      right: 16, width: 72, top: 4, bottom: 4,
      alignment: 'right',
      font: '16px sans-serif'
    }).appendTo(this);
  }

  set track(track) {
    this._track = track;
    this.selected = !!track.selected;
    this.apply({
      '#numberView': {text: track.number},
      '#titleView': {text: track.title},
      '#timeView': {text: formatTime(track.length)},
    });
  }

  get track() {
    return this._track || null;
  }

}

class TrackCell extends Cell {

  constructor(properties) {
    super(Object.assign({
      background: '#323246'
    }, properties));
    this._createUI();
  }

  _createUI() {
    let view = new TrackView({
      left: 0, right: 0, top: 0, bottom: 0
    }).appendTo(this);
    this.on('itemChanged', ({value: track}) => view.track = track);
  }

}

class SectionCell extends Cell {

  constructor(properties) {
    super(properties);
    let textView = new TextView({
      left: 45, right: 85, top: 5, bottom: 5,
      font: 'bold 18px sans-serif'
    }).appendTo(this);
    this.on('itemChanged', ({value: disc}) => {
      textView.text = 'Disc ' + disc.number;
    });
  }

}

export default class AlbumScreen extends Composite {

  constructor(properties) {
    super(Object.assign({background: 'white'}, properties));
    this.on('boundsChanged', () => {
      this.layout();
    });
    let coverSize = Math.min(screen.width, screen.height);
    this._trackListView = new CollectionView({
      itemHeight: item => item.type === 'album' ? coverSize : 50,
      cellType: item => item.type,
      createCell: (type) => {
        if (type === 'album') {
          return new AlbumCell();
        }
        if (type === 'track') {
          return new TrackCell();
        }
        return new SectionCell();
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

  _listenOnBackNavigation() {
    let listener = (event) => {
      event.preventDefault();
      this.close();
    };
    app.on('backNavigation', listener);
    this.on('dispose', () => app.off('backNavigation', listener));
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
