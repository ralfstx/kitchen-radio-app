const TIMEOUT = 8 * 1000;

export function fetch(url, options) {
  return timeout(TIMEOUT, global.fetch(url, options));
}

export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('timeout'));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}
