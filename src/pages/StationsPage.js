import player from "../model/player";
import { loadStations } from "../model/server.js";
import { Page, CollectionView, TextView, ImageView } from "tabris";

export default class StationsPage extends Page {

  constructor() {
    super({
      title: "Radio Stations",
      topLevel: true
    });
    this._stationsList = new CollectionView({
      layoutData: {left: 0, right: 0, top: 0, bottom: 0},
      itemHeight: 60,
      initializeCell: cell => {
        let iconView = new ImageView({
          layoutData: {left: 0, top: 0, width: 120, height: 60},
          scaleMode: "fill"
        }).appendTo(cell);
        let nameView = new TextView({
          layoutData: {left: 130, right: 10, top: 5, bottom: 5},
          textColor: "rgb(74, 74, 74)"
        }).appendTo(cell);
        cell.on("change:item", (view, item) => {
          iconView.set("image", {src: item.iconUrl, width: 300, height: 300});
          nameView.set("text", item.name);
        });
      }
    }).on("select", (view, station) => {
      player.play([station]);
    }).appendTo(this);
  }

  load() {
    loadStations().then(stations => {
      this._stationsList.set("items", stations);
    });
  }

}
