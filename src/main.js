import 'core-js/client/shim.min.js';

import {background} from './model/colors';
import settings from './model/settings';
import MainScreen from './pages/MainScreen';
import DrawerPane from './pages/DrawerPane';
import {ui} from 'tabris';

settings.load();

ui.statusBar.background = background;
ui.statusBar.theme = 'dark';

new DrawerPane({left: 0, top: 0, right: 0, bottom: 0}).appendTo(ui.drawer);
ui.drawer.enabled = true;

new MainScreen({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);
