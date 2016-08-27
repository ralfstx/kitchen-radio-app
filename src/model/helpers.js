
export function splice(items, cols = 2) {
  if (cols <= 0) {
    throw new Error('columns must be >= 1');
  }
  let result = [];
  let row;
  items.forEach((item, index) => {
    if (index % cols === 0) {
      row = [];
      result.push(row);
    }
    row[index % cols] = item;
  });
  return result;
}

export function formatTime(seconds) {
  if (!seconds) {
    return '';
  }
  let pad = n => n < 10 ? '0' + n : '' + n;
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds - (m * 60));
  return m + ':' + pad(s);
}

export function mixin(target, source) {
  if (!target.prototype) {
    throw new Error("target doesn't have a prototype");
  }
  if (source.prototype) {
    source = source.prototype;
  }
  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (name !== 'constructor') {
      Object.defineProperty(target.prototype, name, Object.getOwnPropertyDescriptor(source, name));
    }
  });
}
