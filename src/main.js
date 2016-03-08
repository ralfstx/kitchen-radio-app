var t0 = Date.now();
require("whatwg-fetch");
var t1 = Date.now();
require("babel-polyfill/dist/polyfill.min.js");
var t2 = Date.now();
console.log("loading fetch", t1 - t0);
console.log("loading polyfill", t2 - t1);

import config from "./model/config";
import player from "./model/player";
import AlbumsPage from "./pages/AlbumsPage.js";
import PlaylistPage from "./pages/PlaylistPage.js";
import StationsPage from "./pages/StationsPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { Action, Drawer, PageSelector } from "tabris";

config.load();

new AlbumsPage().open().load();
new StationsPage().load();
new PlaylistPage();
new SettingsPage();

new Action({
  "title": "Stop"
}).on("select", () => {
  player.stop();
});

new Drawer().append(new PageSelector());
