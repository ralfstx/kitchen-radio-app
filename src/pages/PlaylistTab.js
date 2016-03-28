import player from '../model/player';
import { formatTime } from '../model/helpers';
import { Tab, TextView, Slider, CollectionView } from 'tabris';


export default class PlaylistTab extends Tab {

  constructor() {
    super({
      title: 'Playlist'
    });

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

  load() {
    player.status();
  }

  _updateStatus(status) {
    if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
      this._slider.set({maximum: status.totalTime, selection: status.elapsedTime});
    }
  }

  _updatePlaylist(playlist) {
    this._playlistView.set('items', playlist);
  }

}
