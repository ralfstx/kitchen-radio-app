import _ from "underscore";
import config from "../config";
import AlbumPage from "./AlbumPage";
import { Page, TextView, TextInput, ImageView, CollectionView } from "tabris";

function getCoverImage(album) {
  return {src: config.server + "/files/albums/" + album.path + "/cover-250.jpg", width: 250, height: 250};
}

export default class AlbumsPage extends Page {

  constructor() {
    super({
      title: "Collection",
      topLevel: true
    });
    this._albums = [];

    this._filterInput = new TextInput({
      layoutData: {left: 0, right: 0, top: 0},
      message: "filter"
    }).on("change:text", () => {
      this.showAlbums();
    }).appendTo(this);

    this._albumsList = new CollectionView({
      layoutData: {left: 0, right: 0, top: ["prev()", 0], bottom: 0},
      itemHeight: 60,
      initializeCell: cell => {
        let iconView = new ImageView({
          layoutData: {left: 0, top: 0, width: 60, height: 60},
          scaleMode: "fill"
        }).appendTo(cell);
        let nameView = new TextView({
          layoutData: {left: 80, right: 10, top: 5, bottom: 5},
          textColor: "rgb(74, 74, 74)"
        }).appendTo(cell);
        cell.on("change:item", (view, album) => {
          iconView.set("image", getCoverImage(album));
          nameView.set("text", album.name);
        });
      }
    }).on("select", (widget, item) => {
      new AlbumPage(item).open();
    }).appendTo(this);
  }

  load() {
    fetch(config.server + "/files/albums").then(resp => resp.json()).then(result => {
      this._albums = result;
      this.update();
    });
  }

  update() {
    let filter = this._filterInput.get("text");
    if (filter) {
      let match = album => (album.name || "").toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this._albumsList.set("items", this._albums.filter(match));
    } else {
      this._albumsList.set("items", _.shuffle(this._albums));
    }
  }

}
