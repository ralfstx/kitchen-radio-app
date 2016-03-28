import 'core-js/client/shim.min.js';

import settings from './model/settings';
import MainPage from './pages/MainPage';
import Drawer from './pages/Drawer';
import { ui } from 'tabris';

settings.load();

ui.set('toolbarVisible', false);

new Drawer();
new MainPage().open();
