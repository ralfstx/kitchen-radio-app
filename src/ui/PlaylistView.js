import services from '../model/services';
import {formatTime} from '../model/helpers';
import {Composite, TextView, CollectionView, ImageView, app} from 'tabris';
import {getCoverUrl} from '../model/server';
import {getImage} from '../model/images';

const CELL_BG = '#fff';
const CELL_SELECTED_BG = '#eee';

export default class PlaylistView extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: 'white'
    }, properties));
    this._createUI();
    this._listenOnBackNavigation();
    this._init();
  }

  _createUI() {
    this._playlistView = new CollectionView({
      left: 0, right: 0, top: ['prev()', 5], bottom: 0,
      cellHeight: 52,
      createCell: () => new PlaylistCell().on('tap', ({target}) => this._showOverlay(target)),
      updateCell: (cell, index) => {
        cell.item = this._items[index];
        cell.playing = this.playingIndex === index;
      }
    }).on({
      scroll: () => this._hideOverlays()
    }).appendTo(this);
  }

  show() {
    if (!this._hidden || this._animating) return;
    this._animating = true;
    this.animate({
      transform: {}
    }, {
      duration: 150,
      easing: 'ease-out'
    }).then(() => {
      delete this._hidden;
      delete this._animating;
    });
  }

  hide() {
    if (this._hidden || this._animating) return;
    this._animating = true;
    this.animate({
      transform: {translationY: this.bounds.height}
    }, {
      duration: 150,
      easing: 'ease-out'
    }).then(() => {
      this._hidden = true;
      delete this._animating;
    });
  }

  toggle() {
    this._hidden ? this.show() : this.hide();
  }

  _listenOnBackNavigation() {
    let listener = (event) => {
      event.preventDefault();
      this.hide();
    };
    app.on('backNavigation', listener);
    this.on('dispose', () => app.off('backNavigation', listener));
  }

  _init() {
    services.player.on('statusChanged', (status) => this._updateStatus(status));
    services.player.on('playlistChanged', (playlist) => this._updatePlaylist(playlist));
    this._updatePlaylist(services.player.playlist);
    this._updateStatus(services.player.status);
  }

  _showOverlay(cell) {
    this._hideOverlays();
    let {top, height} = cell.bounds;
    top += this._playlistView.bounds.top;
    let overlay = new ItemViewOverlay({
      left: 0, right: 0, top, height
    }).on('!play', () => {
      services.player.play(this._items.indexOf(cell.item));
      overlay.hide();
    }).on('!remove', () => {
      services.player.remove(this._items.indexOf(cell.item));
      overlay.hide();
    }).appendTo(this);
  }

  _hideOverlays() {
    this.find('ItemViewOverlay').forEach(overlay => overlay.hide());
  }

  _updateStatus(status) {
    this.playingIndex = status.track;
    this.trigger('playingIndexChanged');
    // if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
    //   // TODO: update progress view {maximum: status.totalTime, selection: status.elapsedTime}
    // }
  }

  _updatePlaylist(playlist) {
    this._items = playlist;
    this._playlistView.itemCount = playlist.length;
  }

}

class PlaylistCell extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: CELL_BG
    }, properties));
    this._createUI();
  }

  _createUI() {
    new ImageView({
      id: 'image',
      left: 2, top: 1, bottom: 1, width: 50,
      scaleMode: 'fill'
    }).on('tap', () => {
      services.ui.showAlbum(this.item.album);
    }).appendTo(this);
    new TextView({
      id: 'name',
      left: 70, right: 100, top: 4, bottom: 4,
      textColor: 'rgb(74, 74, 74)'
    }).appendTo(this);
    new TextView({
      id: 'time',
      right: 12, top: 4, bottom: 4, width: 80,
      textColor: 'rgb(74, 74, 74)',
      alignment: 'right'
    }).appendTo(this);
  }

  set item(item) {
    this._item = item;
    this.transform = {};
    this.apply({
      '#image': {image: item.album ? getCoverUrl({id: item.album}) : null},
      '#name': {text: item.name},
      '#time': {text: formatTime(item.time)}
    });
  }

  get item() {
    return this._item;
  }

  set playing(playing) {
    this.background = playing ? CELL_SELECTED_BG : CELL_BG;
  }

}

class ItemViewOverlay extends Composite {

  constructor(properties) {
    super(Object.assign({
      opacity: 0
    }, properties));
    new Composite({
      left: 0, top: 0, bottom: 0, right:0,
      background: 'white',
      opacity: 0.75
    }).appendTo(this);
    new ImageView({
      left: 2, top: 1, bottom: 1, width: 50,
      tintColor: 'black',
      scaleMode: 'fill',
      image: getImage('play_arrow_white_24dp')
    }).on('tap', () => {
      this.trigger('!play');
    }).appendTo(this);
    new ImageView({
      right: 2, top: 1, bottom: 1, width: 50,
      tintColor: 'black',
      scaleMode: 'fill',
      image: getImage('clear_white_24dp')
    }).on('tap', () => {
      this.trigger('!remove');
    }).appendTo(this);
    this.on('tap', () => this.hide());
    this.show();
  }

  show() {
    return this.animate({
      opacity: 1
    }, {
      duration: 200
    });
  }

  hide() {
    if (this._hidden) return;
    this._hidden = true;
    return this.animate({
      opacity: 0
    }, {
      duration: 200
    }).then(() => this.dispose());
  }

}
