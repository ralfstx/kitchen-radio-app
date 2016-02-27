/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");

import config from "./config";
import AlbumsPage from "./albums-page.js";
import PlayerPage from "./player-page.js";
import StationsPage from "./stations-page.js";

new PlayerPage().open();
new StationsPage().load();
new AlbumsPage().load();

new tabris.Action({
  "title": "Stop"
}).on("select", () => {
  fetch(config.server + "/stop");
});

new tabris.Drawer().append(new tabris.PageSelector());
