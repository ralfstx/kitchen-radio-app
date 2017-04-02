import {CollectionView, Composite, ImageView, Tab, TextInput, TextView} from 'tabris';
import {shuffle} from '../lib/util';
import settings from '../model/settings';
import services from '../model/services';
import {loadAlbums, getCoverUrl, search} from '../model/server';

class AlbumView extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: '#eee'
    }, properties));
    new TextView({
      id: 'text',
      left: 5, top: 5, right: 5, bottom: 5
    }).appendTo(this);
    new ImageView({
      id: 'image',
      left: 0, top: 0, right: 0, bottom: 0,
      scaleMode: 'fill'
    }).appendTo(this);
    this.on('tap', () => {
      if (this.album) {
        services.ui.showAlbum(this.album.id);
      }
    });
  }

  set album(album) {
    this.find('#text').set('text', album ? album.name : '');
    this.find('#image').set('image', album ? {src: getCoverUrl(album, 250), width: 250, height: 250} : null);
    this._album = album;
  }

  get album() {
    return this._album;
  }

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
    }).on('input', ({text}) => {
      this._filter = text;
      this.update();
    }).appendTo(this);
    this._albumsList = new CollectionView({
      left: 0, right: 0, top: 'prev()', bottom: 0,
      itemHeight: 132,
      columnCount: 3,
      refreshEnabled: true,
      initializeCell: cell => {
        let view = new AlbumView({left: 1, top: 1, right: 1, bottom: 1}).appendTo(cell);
        cell.on('change:item', ({value: item}) => {
          view.album = item;
        });
      }
    }).on('refresh', ({target: view}) => {
      this.load(true).then(() => {
        view.refreshIndicator = false;
      });
    }).appendTo(this);
    this.on('resize', function({width}) {
      let columns = Math.round(width / 132);
      let size = Math.round(width / columns);
      this._albumsList.columnCount = columns;
      this._albumsList.itemHeight = size;
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
    let query = this._filter.toLowerCase();
    if (query) {
      search(query).then(res => this._albumsList.items = res);
    } else {
      this._albumsList.items = shuffle(this._albums.slice());
    }
  }

}
