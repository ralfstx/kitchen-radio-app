import services from '../model/services';
import {formatTime} from '../model/helpers';
import {Composite, Tab, TextView, CollectionView, ImageView} from 'tabris';
import {getCoverUrl} from '../model/server';

const CELL_BG = '#fff';
const CELL_SELECTED_BG = '#eee';

class ItemView extends Composite {

  constructor(properties) {
    super(Object.assign(properties, {
      background: CELL_BG
    }));
    this._createUI();
    this._setupSwipe();
  }

  _createUI() {
    new ImageView({
      id: 'image',
      left: 2, top: 1, bottom: 1, width: 50,
      scaleMode: 'fill'
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

  _setupSwipe() {
    this.on('pan:left', ({translation}) => this.transform = {translationX: translation.x});
    this.on('pan:right', ({translation}) => this.transform = {translationX: translation.x});
    this.on('touchcancel', () => this.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-in'}));
    this.on('touchend', () => {
      let offset = this.transform.translationX;
      let width = this.bounds.width;
      if (offset > width / 2 || offset < -width / 2) {
        this.animate({transform: {translationX: offset < 0 ? -width : width}}, {duration: 200, easing: 'ease-in'})
          .then(this.trigger('dismiss'));
      } else {
        this.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-in'});
      }
    });
  }

  set item(item) {
    this.transform = {};
    this.apply({
      '#image': {image: item.album ? getCoverUrl({id: item.album}) : null},
      '#name': {text: item.name},
      '#time': {text: formatTime(item.time)}
    });
  }

  set playing(playing) {
    this.background = playing ? CELL_SELECTED_BG : CELL_BG;
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
      initializeCell: cell => {
        cell.background = '#ff77ff';
        let itemView = new ItemView({
          left: 0, top: 0, right: 0, bottom: 0
        }).appendTo(cell);
        itemView.on('dismiss', () => services.player.remove(cell.itemIndex));
        cell.on('change:item', ({value: item}) => itemView.item = item);
        cell.on('change:itemIndex', () => itemView.playing = this.playingIndex === cell.itemIndex);
        this.on('change:playingIndex', () => itemView.playing = this.playingIndex === cell.itemIndex);
      }
    }).appendTo(this);

    this.on('appear', () => services.player.status());

    services.player.on('status', (status) => this._updateStatus(status));
    services.player.on('playlist', (playlist) => this._updatePlaylist(playlist));
  }

  load() {
    services.player.status();
  }

  _updateStatus(status) {
    this.playingIndex = status.song;
    this.trigger('change:playingIndex');
    if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
      // TODO: update progress view {maximum: status.totalTime, selection: status.elapsedTime}
    }
  }

  _updatePlaylist(playlist) {
    this._playlistView.items = playlist;
  }

}
