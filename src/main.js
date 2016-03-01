require("whatwg-fetch");
require("babel-polyfill/dist/polyfill.min.js");

import config from "./model/config";
import player from "./model/player";
import AlbumsPage from "./pages/AlbumsPage.js";
import PlayerPage from "./pages/PlayerPage.js";
import StationsPage from "./pages/StationsPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { Action, Drawer, PageSelector } from "tabris";

config.load();

new PlayerPage().open();
new StationsPage().load();
new AlbumsPage().load();
new SettingsPage();

new Action({
  "title": "Stop"
}).on("select", () => {
  player.stop();
});

new Drawer().append(new PageSelector());
