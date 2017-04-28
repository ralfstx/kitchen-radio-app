import {Composite, TabFolder, device} from 'tabris';
import {RED_BACKGROUND} from '../model/colors';
import AlbumsTab from './AlbumsTab';
import AlbumScreen from './AlbumScreen';
import StationsTab from './StationsTab';
import PlaylistView from './PlaylistView';
import StatusView from './StatusView';
import {loadAlbum} from '../model/server';

const STATUS_VIEW_HEIGHT = 32;

export default class MainScreen extends Composite {

  constructor(properties) {
    super(properties);
    this._createUI();
  }

  _createUI() {
    new TabFolder({
      left: 0, top: 0, right: 0, bottom: STATUS_VIEW_HEIGHT,
      paging: !isIOS(),
      background: RED_BACKGROUND,
      textColor: 'white',
      elevation: 2
    }).on('selectionChanged', ({value: tab}) => {
      if (tab.load) {
        tab.load();
      }
    }).append([
      new AlbumsTab(),
      new StationsTab()
    ]).appendTo(this);
    new PlaylistView({
      left: 0, top: 0, right: 0, bottom: STATUS_VIEW_HEIGHT,
      elevation: 8,
    }).on('resize', ({target}) => target.transform = {translationY: target.bounds.height}).appendTo(this);
    new StatusView({
      left: 0, right: 0, bottom: 0, height: STATUS_VIEW_HEIGHT,
      elevation: 12,
    }).appendTo(this);
  }

  showAlbum(albumId) {
    if (!albumId) {
      return;
    }
    this.playlistView.hide();
    let albumsTab = this.find('AlbumsTab').first();
    this.find('TabFolder').set('selection', albumsTab);
    let albumScreen = new AlbumScreen({
      left: 0, top: 0, right: 0, bottom: STATUS_VIEW_HEIGHT,
      transform: {translationY: albumsTab.bounds.height},
      opacity: 0
    }).appendTo(this);
    albumScreen.animate({
      opacity: 1,
      transform: {}
    }, {
      duration: 200,
      easing: 'ease-in'
    });
    loadAlbum(albumId).then(album => albumScreen.album = album);
  }

  get playlistView() {
    return this.find('PlaylistView').first();
  }

}

function isIOS() {
  return device.platform === 'iOS';
}
