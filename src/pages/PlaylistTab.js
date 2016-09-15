import  {player} from '../model/Player';
import {formatTime} from '../model/helpers';
import {Tab, TextView, CollectionView, ImageView} from 'tabris';
import {getCoverUrl} from '../model/server';

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
        let imageView = new ImageView({
          left: 2, top: 1, bottom: 1, width: 50,
          scaleMode: 'fill'
        }).appendTo(cell);
        let nameView = new TextView({
          left: 70, right: 100, top: 4, bottom: 4,
          textColor: 'rgb(74, 74, 74)'
        }).appendTo(cell);
        let timeView = new TextView({
          right: 12, top: 4, bottom: 4, width: 80,
          textColor: 'rgb(74, 74, 74)',
          alignment: 'right'
        }).appendTo(cell);
        cell.on('change:item', (view, item) => {
          imageView.set('image', item.album ? getCoverUrl({id: item.album}) : null);
          nameView.set('text', item.name);
          timeView.set('text', formatTime(item.time));
        });
        let updater = () => {
          let playing = this.get('playingIndex') === cell.get('itemIndex');
          cell.set('background', playing ? '#eee' : '#fff');
        };
        cell.on('change:itemIndex', updater);
        this.on('change:playingIndex', updater);
        updater();
      }
    }).appendTo(this);

    this.on('appear', () => player.status());

    player.on('status', (status) => this._updateStatus(status));
    player.on('playlist', (playlist) => this._updatePlaylist(playlist));
  }

  load() {
    player.status();
  }

  _updateStatus(status) {
    this.set('playingIndex', status.song);
    if (Number.isFinite(status.totalTime) && Number.isFinite(status.elapsedTime)) {
      // TODO: update progress view {maximum: status.totalTime, selection: status.elapsedTime}
    }
  }

  _updatePlaylist(playlist) {
    this._playlistView.set('items', playlist);
  }

}
