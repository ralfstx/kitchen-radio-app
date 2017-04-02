import {Composite, ImageView, TextView} from 'tabris';
import {getImage} from '../model/images';
import services from '../model/services';

export default class StatusView extends Composite {

  constructor(properties) {
    super(Object.assign({
      background: 'gray',
    }, properties));
    new ImageView({
      id: 'statusIcon',
      top: 2, bottom: 2, left: 16
    }).appendTo(this);
    new TextView({
      id: 'statusText',
      top: 2, bottom: 2, left: 52, right: 52,
      textColor: 'white'
    }).appendTo(this);
    this.on('tap', () => services.ui.showPlaylist());
    this._init();
  }

  _init() {
    services.player.on('change:status', () => this._update());
    services.player.on('change:playlist', () => this._update());
    this._update();
  }

  _update() {
    let {status, playlist} = services.player;
    let icons = {
      play: 'play_arrow',
      pause: 'pause'
    };
    let image = status.state in icons ? getImage(icons[status.state] + '_white_24dp') : null;
    let text = status.state === 'play' || status.state === 'pause' ?
      (status.song + 1) + ' of ' + playlist.length :
      playlist.length + ' tracks';
    this.apply({
      '#statusIcon': {image},
      '#statusText': {text}
    });
  }

}
