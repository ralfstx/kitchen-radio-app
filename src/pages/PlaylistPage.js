import player from '../model/player';
import { getImage } from '../model/images';
import { formatTime } from '../model/helpers';
import { Page, Composite, ImageView, TextView, Slider, CollectionView } from 'tabris';

class ButtonBar extends Composite {

  addButton(icon, command) {
    new ImageView({
      top: 4, left: 'prev() 4', width: 48, height: 48,
      image: getImage(icon + '_black_36dp'),
      scaleMode: 'none',
      highlightOnTouch: true
    }).on('tap', command).appendTo(this);
    return this;
  }

}

export default class PlaylistPage extends Page {

  constructor() {
    super({
      title: 'Player',
      topLevel: true
    });

    new ButtonBar({ left: 12, top: 12 })
      .addButton('skip_previous', () => player.prev())
      .addButton('pause', () => player.pause())
      .addButton('skip_next', () => player.next())
      .addButton('refresh', () => player.status())
      .appendTo(this);

    this._statusView = new TextView({
      left: 0, right: 0, top: 'prev()',
      text: '...'
    }).appendTo(this);

    this._slider = new Slider({
      left: 0, right: 0, top: ['prev()', 5],
      maximum: 1000
    }).appendTo(this);

    this._playlistView = new CollectionView({
      left: 0, right: 0, top: ['prev()', 5], bottom: 0,
      itemHeight: 40,
      initializeCell: cell => {
        let nameView = new TextView({
          left: 12, right: 100, top: 4, bottom: 4,
          textColor: 'rgb(74, 74, 74)'
        }).appendTo(cell);
        let timeView = new TextView({
          right: 12, top: 4, bottom: 4, width: 80,
          textColor: 'rgb(74, 74, 74)',
          alignment: 'right'
        }).appendTo(cell);
        cell.on('change:item', (view, item) => {
          nameView.set('text', item.name);
          timeView.set('text', formatTime(item.time));
        });
      }
    }).appendTo(this);

    this.on('appear', () => player.status() );

    player.on('status', (status) => this._updateStatus(status));
    player.on('playlist', (playlist) => this._updatePlaylist(playlist));
  }

  _updateStatus(status) {
    this._statusView.set('text', status.state);
    if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
      this._slider.set({maximum: status.totalTime, selection: status.elapsedTime});
    }
  }

  _updatePlaylist(playlist) {
    this._playlistView.set('items', playlist);
  }

}
