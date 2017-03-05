import {device} from 'tabris';

const supportedRatios = [1, 1.5, 2, 3, 4];

export function getImage(name, width, height) {
  let scale = getScale();
  let image = {src: `images/${name}@${scale}x.png`};
  if (width && height) {
    image.width = width;
    image.height = height;
  } else {
    image.scale = scale;
  }
  return image;
}

function getScale() {
  let scale = device.scaleFactor;
  return supportedRatios.reduce((prev, curr) => fit(prev, scale) > fit(curr, scale) ? prev : curr);
}

function fit(ratio, scale) {
  return ratio < scale ? ratio - scale : 1 / (ratio - scale);
}
