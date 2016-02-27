import config from "./config";
import {Page, CollectionView, TextView, ImageView} from "tabris";

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
          iconView.set("image", item.icon);
          nameView.set("text", item.name);
        });
      }
    }).on("select", (widget, item) => {
      this.tuneIn(item);
    }).appendTo(this);
  }

  load() {
    fetch(config.server + "/files/stations").then(rsp => rsp.json()).then(stations => {
      this._stationsList.set("items", stations.map(item => ({
        name: item.name,
        stream: item.stream,
        icon: {src: config.server + "/files/stations/" + item.icon, width: 300, height: 300}
      })));
    });
  }

  tuneIn(station) {
    fetch(config.server + "/play/" + station.stream);
  }

}
