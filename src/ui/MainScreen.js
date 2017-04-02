import {Composite, TabFolder, device} from 'tabris';
import {background} from '../model/colors';
import AlbumsTab from './AlbumsTab';
import AlbumScreen from './AlbumScreen';
import StationsTab from './StationsTab';
import PlaylistTab from './PlaylistTab';
import {loadAlbum} from '../model/server';


export default class MainScreen extends Composite {

  constructor(properties) {
    super(properties);
    this._createUI();
  }

  _createUI() {
    new TabFolder({
      left: 0, top: 0, right: 0, bottom: 0,
      paging: !isIOS(),
      background: background,
      textColor: 'white',
      elevation: 2
    }).on('change:selection', ({value: tab}) => {
      if (tab.load) {
        tab.load();
      }
    }).append([
      new AlbumsTab(),
      new StationsTab(),
      new PlaylistTab()
    ]).appendTo(this);
  }

  showAlbum(albumId) {
    if (!albumId) {
      return;
    }
    let albumsTab = this.find('AlbumsTab').first();
    this.find('TabFolder').set('selection', albumsTab);
    let albumScreen = new AlbumScreen({
      left: 0, top: 0, right: 0, bottom: 0,
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

}

function isIOS() {
  return device.platform === 'iOS';
}
