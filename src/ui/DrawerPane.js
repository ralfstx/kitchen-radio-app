import services from '../model/services';
import {background} from '../model/colors';
import {getImage} from '../model/images';
import SettingsScreen from './SettingsScreen';
import {Composite, TextView, ImageView, ui} from 'tabris';

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

export default class DrawerPane extends Composite {

  constructor(properties) {
    super(properties);
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
      ui.drawer.close();
      new SettingsScreen({
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(ui.contentView);
    }).appendTo(this);

    new ButtonBar({centerX: 0, bottom: 16})
      .addButton('skip_previous', () => services.player.prev())
      .addButton('pause', () => services.player.pause())
      .addButton('stop', () => services.player.stop())
      .addButton('skip_next', () => services.player.next())
      .addButton('refresh', () => services.player.update())
      .appendTo(this);

    services.player.on('change:status', (status) => {
      this._updateStatus(status);
    });
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
