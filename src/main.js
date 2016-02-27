require("whatwg-fetch");
require("babel-polyfill/dist/polyfill.min.js");

import config from "./config";
import AlbumsPage from "./pages/albums-page.js";
import PlayerPage from "./pages/player-page.js";
import StationsPage from "./pages/stations-page.js";
import { Action, Drawer, PageSelector } from "tabris";

new PlayerPage().open();
new StationsPage().load();
new AlbumsPage().load();

new Action({
  "title": "Stop"
}).on("select", () => {
  fetch(config.server + "/stop");
});

new Drawer().append(new PageSelector());
