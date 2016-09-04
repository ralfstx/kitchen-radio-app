import _ from 'underscore';
import settings from '../model/settings';
import {loadAlbums, loadAlbum, getCoverUrl} from '../model/server';
import AlbumPage from './AlbumPage';
import {Tab, TextInput, ImageView, CollectionView} from 'tabris';

function albumView(properties) {
  return new ImageView(Object.assign({
    scaleMode: 'fill',
    background: 'white'
  }, properties)).on('change:album', (view, album) => {
    view.set('image', album ? {src: getCoverUrl(album, 250), width: 250, height: 250} : null);
  }).on('tap', view => {
    let album = view.get('album');
    if (album) {
      let page = new AlbumPage().open();
      let path = album.path;
      loadAlbum(path).then(album => {
        album.path = path;
        page.album = album;
      });
    }
  });
}

export default class AlbumsTab extends Tab {

  constructor() {
    super({
      title: 'Albums',
      background: 'white'
    });
    this._albums = [];
    this._filter = '';
    new TextInput({
      left: 8, right: 8, top: 0,
      message: 'filter'
    }).on('input', (view, text) => {
      this._filter = text;
      this.update();
    }).appendTo(this);
    this._albumsList = new CollectionView({
      left: 0, right: 0, top: 'prev()', bottom: 0,
      itemHeight: 132,
      columnCount: 3,
      refreshEnabled: true,
      initializeCell: cell => {
        let view = albumView({left: 1, top: 1, right: 1, bottom: 1}).appendTo(cell);
        cell.on('change:item', (cell, item) => {
          view.set('album', item);
        });
      }
    }).on('refresh', (view) => {
      this.load(true).then(() => {
        view.set('refreshIndicator', false);
      });
    }).appendTo(this);
    this.on('resize', function(widget, bounds) {
      let columns = Math.round(bounds.width / 132);
      let size = Math.round(bounds.width / columns);
      this._albumsList.set({
        columnCount: columns,
        itemHeight: size
      });
    });
    settings.on('change:serverUrl', () => {
      this.load(true);
    });
    // TODO load on appear when this exists on a Tab
    this.load();
  }

  load(force) {
    if (force || !this._loaded) {
      return loadAlbums().then(albums => {
        if (albums) {
          this._loaded = true;
          this._albums = albums;
          this.update();
        }
      });
    }
  }

  update() {
    let filter = this._filter.toLowerCase();
    if (filter) {
      let match = album => (album.name || '').toLowerCase().indexOf(filter) !== -1;
      this._albumsList.set('items', this._albums.filter(match));
    } else {
      this._albumsList.set('items', _.shuffle(this._albums));
    }
  }

}
