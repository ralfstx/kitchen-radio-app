import services from '../model/services';
import {formatTime} from '../model/helpers';
import {Cell, Composite, Tab, TextView, CollectionView, ImageView} from 'tabris';
import {getCoverUrl} from '../model/server';
import {getImage} from '../model/images';
import {enableSwipe} from './swipe-to-dismiss';

const CELL_BG = '#fff';
const CELL_SELECTED_BG = '#eee';

class ItemView extends Composite {

  constructor(properties) {
    super(Object.assign(properties, {
      background: CELL_BG
    }));
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
      opacity: 0.5
    }).appendTo(this);
    new ImageView({
      left: 2, top: 1, bottom: 1, width: 50,
      tintColor: 'black',
      scaleMode: 'fill',
      image: getImage('play_arrow_white_24dp')
    }).on('tap', () => {
      this.trigger('!play');
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

export default class PlaylistTab extends Tab {

  constructor() {
    super({
      title: 'Playlist',
      background: 'white'
    });

    this._playlistView = new CollectionView({
      left: 0, right: 0, top: ['prev()', 5], bottom: 0,
      itemHeight: 52,
      createCell: () => {
        let cell = new Cell();
        cell.background = '#900000';
        let itemView = new ItemView({
          left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(cell);
        enableSwipe(itemView);
        itemView.on('tap', () => this._showOverlay(cell));
        itemView.on('dismiss', () => services.player.remove(cell.itemIndex));
        cell.on('change:item', ({value: item}) => itemView.item = item);
        cell.on('change:itemIndex', () => itemView.playing = this.playingIndex === cell.itemIndex);
        this.on('change:playingIndex', () => itemView.playing = this.playingIndex === cell.itemIndex);
        return cell;
      }
    }).appendTo(this);
    this._playlistView.on('scroll', () => this._hideOverlays());

    services.player.on('change:status', (status) => this._updateStatus(status));
    services.player.on('change:playlist', (playlist) => this._updatePlaylist(playlist));
  }

  load() {
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
      services.player.play(cell.itemIndex);
      overlay.hide();
    }).appendTo(this);
  }

  _hideOverlays() {
    this.find('ItemViewOverlay').forEach(overlay => overlay.hide());
  }

  _updateStatus(status) {
    this.playingIndex = status.song;
    this.trigger('change:playingIndex');
    // if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
    //   // TODO: update progress view {maximum: status.totalTime, selection: status.elapsedTime}
    // }
  }

  _updatePlaylist(playlist) {
    this._playlistView.items = playlist;
  }

}
