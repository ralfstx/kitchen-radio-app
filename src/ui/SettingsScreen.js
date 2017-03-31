import settings from '../model/settings';
import {Button, Composite, TextView, TextInput, app} from 'tabris';
import {shutdown} from '../model/server';

const labelWidth = 120;

export default class SettingsScreen extends Composite {

  constructor(properties) {
    super(Object.assign({background: 'white'}, properties));
    new TextView({
      centerX: 0, top: 16,
      font: 'bold 24px sans-serif',
      text: 'Settings'
    }).appendTo(this);
    new TextView({
      left: 16, top: 'prev() 32', width: labelWidth - 4,
      text: 'Server URL:'
    }).appendTo(this);
    new TextInput({
      id: 'server-url',
      left: labelWidth + 4, baseline: 'prev()', right: 16,
      keyboard: 'url',
      text: settings.serverUrl
    }).appendTo(this);
    new Button({
      left: 16, top: 'prev() 32', right: 16,
      text: 'Apply'
    }).on('select', () => {
      this.close();
    }).appendTo(this);
    new Button({
      left: 16, top: 'prev() 32', right: 16,
      text: 'Shut down'
    }).on('longpress', () => {
      shutdown();
    }).appendTo(this);
    this._listenOnBackNavigation();
  }

  _listenOnBackNavigation() {
    let listener = (event) => {
      event.preventDefault();
      this.close();
    };
    app.on('backnavigation', listener);
    this.on('dispose', () => app.off('backnavigation', listener));
  }

  close() {
    this.saveSettings();
    this.animate({
      transform: {translationX: -this.bounds.width}
    }, {
      duration: 100,
      easing: 'ease-out'
    }).then(() => this.dispose());
  }

  saveSettings() {
    settings.serverUrl = this.find('#server-url').get('text');
  }

}
