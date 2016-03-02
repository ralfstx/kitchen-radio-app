import config from "../model/config";
import player from "../model/player";
import { splice } from "../model/helpers";
import { loadStations } from "../model/server.js";
import { Page, CollectionView, ImageView } from "tabris";

function stationView(properties) {
  return new ImageView(Object.assign({
    scaleMode: "fill", elevation: 2
  }, properties)).on("change:station", (view, station) => {
    view.set("image", station ? {src: station.iconUrl, width: 300, height: 300} : null);
  }).on("tap", view => {
    let station = view.get("station");
    if (station) {
      player.play(station);
    }
  });
}

export default class StationsPage extends Page {

  constructor() {
    super({
      title: "Radio Stations",
      topLevel: true
    });
    this._stationsList = new CollectionView({
      layoutData: {left: 0, right: 0, top: 0, bottom: 0},
      itemHeight: 88,
      initializeCell: cell => {
        let view1 = stationView({ left: 8, top: 4, right: "50% 4", height: 80 }).appendTo(cell);
        let view2 = stationView({ left: "50% 4", top: 4, right: 8, height: 80 }).appendTo(cell);
        cell.on("change:item", (view, item) => {
          view1.set("station", item[0]);
          view2.set("station", item[1]);
        });
      }
    }).appendTo(this);
    config.on("change:serverUrl", () => {
      this.load();
    });
  }

  load() {
    loadStations().then(stations => {
      this._stationsList.set("items", splice(stations));
    });
  }

}
