/* globals fetch: false, Promise: true*/

Promise = require("promise");
require("whatwg-fetch");

let config = require("./config");

exports.create = function() {

  let page = new tabris.Page({
    title: "Radio Stations",
    topLevel: true
  });

  let stationsList = new tabris.CollectionView({
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    itemHeight: 60,
    initializeCell: cell => {
      let iconView = new tabris.ImageView({
        layoutData: {left: 0, top: 0, width: 120, height: 60},
        scaleMode: "fill"
      }).appendTo(cell);
      let nameView = new tabris.TextView({
        layoutData: {left: 130, right: 10, top: 5, bottom: 5},
        textColor: "rgb(74, 74, 74)"
      }).appendTo(cell);
      cell.on("change:item", (view, item) => {
        iconView.set("image", item.icon);
        nameView.set("text", item.name);
      });
    }
  }).on("select", (widget, item) => {
    tuneIn(item);
  }).appendTo(page);

  fetch(config.server + "/files/stations").then(rsp => rsp.json()).then(stations => {
    showStations(stations);
  });

  function showStations(stations) {
    stationsList.set("items", stations.map(item => ({
      name: item.name,
      stream: item.stream,
      icon: {src: config.server + "/files/stations/" + item.icon, width: 300, height: 300}
    })));
  }

  function tuneIn(station) {
    fetch(config.server + "/play/" + station.stream);
  }

  return page;

};
