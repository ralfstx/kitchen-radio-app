import services from '../model/services';
import {getCoverUrl} from '../model/server';
import {getImage} from '../model/images';
import {formatTime} from '../model/helpers';
import {Composite, TextView, ImageView, CollectionView, app} from 'tabris';
import SelectableView from './SelectableView';

export default class AlbumScreen extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: 'white'
    }, properties));
    this.on({
      boundsChanged: () => this.layout()
    });
    let coverSize = Math.min(screen.width, screen.height);
    this._trackListView = new CollectionView({
      cellHeight: index => this._items[index].type === 'album' ? coverSize : 50,
      cellType: index => this._items[index].type,
      createCell: (type) => {
        if (type === 'album') {
          return new AlbumCell();
        }
        if (type === 'track') {
          return new TrackCell();
        }
        return new SectionCell();
      },
      updateCell: (cell, index) => cell.item = this._items[index]
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
    this._items = getItems(this._album);
    this._trackListView.itemCount = this._items.length;
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

class AlbumCell extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: 'gray'
    }, properties));
    this._createUI();
  }

  _createUI() {
    new ImageView({
      id: 'coverView',
      left: 0, right: 0, top: 0, bottom: 0,
      scaleMode: 'fill'
    }).appendTo(this);
    new ImageView({
      right: 125, bottom: 50, width: 50, height: 50, cornerRadius: 25,
      elevation: 4,
      background: '#323246',
      image: getImage('play_arrow_white_36dp')
    }).on({
      tap: () => services.player.play(this._getTracks())
    }).appendTo(this);
    new ImageView({
      right: 50, bottom: 50, width: 50, height: 50, cornerRadius: 25,
      elevation: 4,
      background: '#323246',
      image: getImage('playlist_add_white_36dp')
    }).on({
      tap: () => services.player.append(this._getTracks())
    }).appendTo(this);
    this.on({
      tap: detectDoubleTap,
      doubleTap: () => this._toggleTracks()
    });
  }

  set item(album) {
    this._album = album;
    this.find('#coverView').set({image: {src: getCoverUrl(album), width: 250, height: 250}});
  }

  _getTracks() {
    let selected = this._album.tracks.filter(track => track.selected);
    return selected.length ? selected : this._album.tracks;
  }

  _toggleTracks() {
    this._album.tracks.forEach(track => track.selected = !track.selected);
    this.parent().refresh();
  }

}

class SectionCell extends Composite {

  constructor(properties) {
    super(properties);
    this._createUI();
  }

  _createUI() {
    new TextView({
      id: 'textView',
      left: 45, right: 85, top: 5, bottom: 5,
      font: 'bold 18px sans-serif'
    }).appendTo(this);
    this.on({
      tap: detectDoubleTap,
      doubleTap: () => this._toggleTracks()
    });
  }

  set item(disc) {
    this._disc = disc;
    this.find('#textView').set({text: 'Disc ' + disc.number});
  }

  _toggleTracks() {
    this._disc.tracks.forEach(track => track.selected = !track.selected);
    this.parent().refresh();
  }

}

class TrackCell extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: '#323246',
    }, properties));
    this._createUI();
  }

  _createUI() {
    let container = new SelectableView({
      id: 'selectableView',
      left: 0, top: 0, right: 0, bottom: 0,
      background: 'white'
    }).on({
      selectedChanged: ({value: selected}) => this._track ? this._track.selected = selected : null
    }).appendTo(this);
    new TextView({
      id: 'numberView',
      left: 8, width: 32, top: 4, bottom: 4,
      alignment: 'right',
      opacity: 0.25,
      font: '16px sans-serif'
    }).appendTo(container);
    new TextView({
      id: 'titleView',
      left: 48, right: 84, top: 4, bottom: 4,
      font: '16px sans-serif'
    }).appendTo(container);
    new TextView({
      id: 'timeView',
      right: 16, width: 72, top: 4, bottom: 4,
      alignment: 'right',
      font: '16px sans-serif'
    }).appendTo(container);
  }

  set item(track) {
    this._track = track;
    this.apply({
      '#selectableView': {selected: !!track.selected},
      '#numberView': {text: track.number},
      '#titleView': {text: track.title},
      '#timeView': {text: formatTime(track.length)},
    });
  }

  get item() {
    return this._track || null;
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

function detectDoubleTap({target, timeStamp}) {
  if (timeStamp - target._lastTap < 350) {
    target.trigger('doubleTap');
  }
  target._lastTap = timeStamp;
}
