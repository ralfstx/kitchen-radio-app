
export function isArray(o) {
  return Array.isArray(o);
}

export function isObject(o) {
  return o !== null && typeof o === 'object';
}

export function isInteger(o) {
  return Number.isInteger(o);
}
