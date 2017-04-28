import settings from '../model/settings';
import services from '../model/services';
import {loadStations} from '../model/server.js';
import {Tab, CollectionView, Composite, ImageView, TextView} from 'tabris';

class StationView extends Composite {

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
      if (this.station) {
        services.player.play(this.station);
      }
    });
  }

  set station(station) {
    this.find('#text').set('text', station ? station.name : '');
    this.find('#image').set('image', station ? {src: station.iconUrl, width: 300, height: 300} : null);
    this._station = station;
  }

  get station() {
    return this._station;
  }

}

export default class StationsTab extends Tab {

  constructor() {
    super({
      title: 'Stations',
      background: 'white'
    });
    this._stationsList = new CollectionView({
      layoutData: {left: 0, right: 0, top: 0, bottom: 0},
      cellHeight: 88,
      columnCount: 2,
      refreshEnabled: true,
      createCell: () => new StationView(),
      updateCell: (cell, index) => cell.station = this._stations[index]
    }).on('refresh', ({target: view}) => {
      this.load(true).then(() => {
        view.refreshIndicator = false;
      });
    }).appendTo(this);
    this.on('resize', function({width}) {
      let columns = Math.round(width / 200);
      let size = Math.round(width / columns * 0.4);
      this._stationsList.columnCount = columns;
      this._stationsList.cellHeight = size;
    });
    settings.on('serverUrlChanged', () => {
      this.load(true);
    });
  }

  load(force) {
    if (force || !this._loaded) {
      return loadStations().then(stations => {
        if (stations) {
          this._loaded = true;
          this._stations = stations;
          this._stationsList.itemCount = stations.length;
        }
      });
    }
  }

}
