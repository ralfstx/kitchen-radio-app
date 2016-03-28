import _ from "underscore";
import settings from "../model/settings";
import { splice } from "../model/helpers";
import { loadAlbums, loadAlbum } from "../model/server";
import AlbumPage from "./AlbumPage";
import { Tab, TextInput, ImageView, CollectionView } from "tabris";

function albumView(properties) {
  return new ImageView(Object.assign({
    scaleMode: "fill",
    background: "white",
    elevation: 2
  }, properties)).on("change:album", (view, album) => {
    view.set("image", album ? {src: album.coverUrl, width: 250, height: 250} : null);
  }).on("tap", view => {
    let album = view.get("album");
    if (album) {
      let page = new AlbumPage().open();
      loadAlbum(album.path).then(album => {
        page.album = album;
      });
    }
  });
}

export default class AlbumsTab extends Tab {

  constructor() {
    super({
      title: "Albums"
    });
    this._albums = [];
    this._filter = '';
    new TextInput({
      left: 8, right: 8, top: 0,
      message: "filter"
    }).on("input", (view, text) => {
      this._filter = text;
      this.update();
    }).appendTo(this);
    this._albumsList = new CollectionView({
      left: 0, right: 0, top: "prev()", bottom: 0,
      itemHeight: 132,
      initializeCell: cell => {
        let view1 = albumView({ left: 12, top: 4, width: 124, height: 124 }).appendTo(cell);
        let view2 = albumView({ left: 144, top: 4, width: 124, height: 124 }).appendTo(cell);
        let view3 = albumView({ left: 276, top: 4, width: 124, height: 124 }).appendTo(cell);
        cell.on("change:item", (view, row) => {
          view1.set("album", row[0]);
          view2.set("album", row[1]);
          view3.set("album", row[2]);
        });
      }
    }).appendTo(this);
    settings.on("change:serverUrl", () => {
      this.load();
    });
    // TODO load on appear when this exists on a Tab
    this.load();
  }

  load() {
    if (!this._loaded) {
      loadAlbums().then(albums => {
        this._loaded = true;
        this._albums = albums;
        this.update();
      });
    }
  }

  update() {
    let filter = this._filter.toLowerCase();
    if (filter) {
      let match = album => (album.name || "").toLowerCase().indexOf(filter) !== -1;
      this._albumsList.set("items", splice(this._albums.filter(match), 3));
    } else {
      this._albumsList.set("items", splice(_.shuffle(this._albums), 3));
    }
  }

}
