import "core-js/client/shim.min.js";

import settings from "./model/settings";
import player from "./model/player";
import AlbumsPage from "./pages/AlbumsPage.js";
import PlaylistPage from "./pages/PlaylistPage.js";
import StationsPage from "./pages/StationsPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { Action, Drawer, PageSelector } from "tabris";

settings.load();

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
