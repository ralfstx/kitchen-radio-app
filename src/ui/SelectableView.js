import {Composite} from 'tabris';

const indent = 8;

export default class SelectableView extends Composite {

  constructor(properties) {
    super(properties);
    this.on('pan:horizontal', handlePan);
  }

  set selected(selected) {
    if (!!selected !== this.selected) {
      this._selected = !!selected;
      this._trigger('change:selected', {value: this._selected});
      this.transform = this._selected ? {translationX: indent} : {};
    }
  }

  get selected() {
    return this._selected;
  }

}

function handlePan(event) {
  let {target, velocityX} = event;
  if (Math.abs(velocityX) > 50) {
    let selected = velocityX > 0;
    target.selected = selected;
    target.transform = selected ? {translationX: indent} : {};
  }
}
