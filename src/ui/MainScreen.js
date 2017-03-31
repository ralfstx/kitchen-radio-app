import {background} from '../model/colors';
import AlbumsTab from './AlbumsTab.js';
import StationsTab from './StationsTab.js';
import PlaylistTab from './PlaylistTab.js';
import {Composite, TabFolder, device} from 'tabris';


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

}

function isIOS() {
  return device.platform === 'iOS';
}
