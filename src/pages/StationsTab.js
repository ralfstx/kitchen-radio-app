import settings from '../model/settings';
import player from '../model/player';
import {loadStations} from '../model/server.js';
import {Tab, CollectionView, ImageView} from 'tabris';

function stationView(properties) {
  return new ImageView(Object.assign({
    scaleMode: 'fill',
    background: 'white'
  }, properties)).on('change:station', (view, station) => {
    view.set('image', station ? {src: station.iconUrl, width: 300, height: 300} : null);
  }).on('tap', view => {
    let station = view.get('station');
    if (station) {
      player.play(station);
    }
  });
}

export default class StationsTab extends Tab {

  constructor() {
    super({
      title: 'Stations',
      background: 'white'
    });
    this._stationsList = new CollectionView({
      layoutData: {left: 0, right: 0, top: 0, bottom: 0},
      itemHeight: 88,
      columnCount: 2,
      refreshEnabled: true,
      initializeCell: cell => {
        let view = stationView({left: 1, top: 1, right: 1, bottom: 1}).appendTo(cell);
        cell.on('change:item', (cell, item) => {
          view.set('station', item);
        });
      }
    }).on('refresh', (view) => {
      this.load(true).then(() => {
        view.set('refreshIndicator', false);
      });
    }).appendTo(this);
    this.on('resize', function(widget, bounds) {
      let columns = Math.round(bounds.width / 200);
      let size = Math.round(bounds.width / columns * 0.4);
      this._stationsList.set({
        columnCount: columns,
        itemHeight: size
      });
    });
    settings.on('change:serverUrl', () => {
      this.load(true);
    });
  }

  load(force) {
    if (force || !this._loaded) {
      return loadStations().then(stations => {
        if (stations) {
          this._loaded = true;
          this._stationsList.set('items', stations);
        }
      });
    }
  }

}
