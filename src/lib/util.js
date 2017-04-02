
export function isArray(o) {
  return Array.isArray(o);
}

export function isObject(o) {
  return o !== null && typeof o === 'object';
}

export function isInteger(o) {
  return Number.isInteger(o);
}

export function shuffle(array) {
  for (let i = array.length; i; i--) {
    let rand = Math.floor(Math.random() * i);
    [array[i - 1], array[rand]] = [array[rand], array[i - 1]];
  }
  return array;
}
