
export function formatTime(seconds) {
  if (!(seconds > 0)) {
    return '';
  }
  let pad = n => n < 10 ? '0' + n : '' + n;
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds - (m * 60));
  return m + ':' + pad(s);
}
