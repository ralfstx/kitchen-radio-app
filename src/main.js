import 'core-js/client/shim.min.js';

import {background} from './model/colors';
import settings from './model/settings';
import MainPage from './pages/MainPage';
import Drawer from './pages/Drawer';
import {ui} from 'tabris';

settings.load();

ui.set({
  toolbarVisible: false,
  background: background,
  statusBarTheme: 'dark'
});

new Drawer();
new MainPage().open();
