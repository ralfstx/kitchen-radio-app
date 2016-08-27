import settings from '../model/settings';
import {Page, TextView, TextInput, ui} from 'tabris';

const labelWidth = 120;

export default class SettingsPage extends Page {

  constructor() {
    super({
      title: 'Settings'
    });
    this.on('appear', () => {
      ui.set('toolbarVisible', true);
    }).on('disappear', () => {
      ui.set('toolbarVisible', false);
    });
    new TextView({
      left: 16, top: 16, width: labelWidth - 4,
      text: 'Server URL:'
    }).appendTo(this);
    new TextInput({
      left: labelWidth + 4, baseline: 'prev()', right: 16,
      keyboard: 'url',
      text: settings.serverUrl
    }).on('blur', (view) => {
      settings.serverUrl = view.get('text');
    }).appendTo(this);
  }

}
