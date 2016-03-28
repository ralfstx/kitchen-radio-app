import AlbumsTab from "./AlbumsTab.js";
import StationsTab from "./StationsTab.js";
import PlaylistTab from "./PlaylistTab.js";
import { Page, TabFolder } from "tabris";


export default class MainPage extends Page {

  constructor() {
    super({
      topLevel: true
    });

    new TabFolder({
      left: 0, top: 0, right: 0, bottom: 0,
      paging: true
    }).on('change:selection', (folder, tab) => {
      if (tab.load) {
        tab.load();
      }
    }).append([
      new AlbumsTab(),
      new StationsTab(),
      new PlaylistTab()
    ]).appendTo(this);
  }

}
