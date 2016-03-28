import player from "../model/player";
import { getImage } from '../model/images';
import SettingsPage from './SettingsPage';
import { Drawer as TbDrawer, Composite, TextView, ImageView } from "tabris";

class ButtonBar extends Composite {

  addButton(icon, command) {
    new ImageView({
      top: 4, left: 'prev() 4', width: 48, height: 48,
      image: getImage(icon + '_black_36dp'),
      scaleMode: 'none',
      highlightOnTouch: true
    }).on('tap', command).appendTo(this);
    return this;
  }

}

export default class Drawer extends TbDrawer {

  constructor() {
    super();
    new ButtonBar({ left: 12, top: 12 })
      .addButton('skip_previous', () => player.prev())
      .addButton('pause', () => player.pause())
      .addButton('stop', () => player.stop())
      .addButton('skip_next', () => player.next())
      .addButton('refresh', () => player.status())
      .appendTo(this);

    this._statusView = new TextView({
      left: 0, right: 0, top: 'prev()',
      text: '...'
    }).appendTo(this);

    new TextView({
      left: 24, right: 16, top: 'prev() 16',
      font: '18px sans-serif',
      text: 'Settings'
    }).on('tap', () => {
      new SettingsPage().open();
      this.close();
    }).appendTo(this);

    player.on('status', (status) => {
      this._updateStatus(status);
    });
    player.status();
  }

  _updateStatus(status) {
    this._statusView.set('text', status.state);
  }

}
