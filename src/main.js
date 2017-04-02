import 'core-js/client/shim.min.js';
import {ui} from 'tabris';

import services from './model/services';
import settings from './model/settings';
import {background} from './model/colors';
import WSClient from './model/WSClient';
import Player from './model/Player';
import MainScreen from './ui/MainScreen';
import DrawerPane from './ui/DrawerPane';

settings.load();

services.wsClient = new WSClient();
services.player = new Player();

ui.statusBar.background = background;
ui.statusBar.theme = 'dark';

new DrawerPane({left: 0, top: 0, right: 0, bottom: 0}).appendTo(ui.drawer);
ui.drawer.enabled = true;

services.ui = new MainScreen({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);
