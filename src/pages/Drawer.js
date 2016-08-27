import player from '../model/player';
import {background} from '../model/colors';
import {getImage} from '../model/images';
import SettingsPage from './SettingsPage';
import {Drawer as TbDrawer, Composite, TextView, ImageView} from 'tabris';

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
    new Composite({
      id: 'header',
      left: 0, right: 0, top: 0, height: 120,
      background: background
    }).append([
      new ImageView({
        id: 'statusIcon',
        left: 16, top: 16, width: 36, height: 36
      }),
      new TextView({
        id: 'statusText',
        left: 'prev() 12', top: 16, right: 16, height: 36,
        font: '14px sans-serif',
        textColor: 'white'
      })
    ]).appendTo(this);

    new TextView({
      left: 24, right: 16, top: 'prev() 16',
      font: '18px sans-serif',
      text: 'Settings'
    }).on('tap', () => {
      new SettingsPage().open();
      this.close();
    }).appendTo(this);

    new ButtonBar({centerX: 0, bottom: 16})
      .addButton('skip_previous', () => player.prev())
      .addButton('pause', () => player.pause())
      .addButton('stop', () => player.stop())
      .addButton('skip_next', () => player.next())
      .addButton('refresh', () => player.status())
      .appendTo(this);

    player.on('status', (status) => {
      this._updateStatus(status);
    });
    player.status();
  }

  _updateStatus(status) {
    let icons = {
      play: 'play_arrow',
      pause: 'pause'
    };
    let icon = status.state in icons ? getImage(icons[status.state] + '_white_24dp') : null;
    this.apply({
      '#statusIcon': {'image': icon}
    });
  }

}
