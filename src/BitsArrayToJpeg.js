/* eslint no-bitwise: ["error", { "allow": ["<<"] }] */

const jpeg = require('jpeg-js');
const fs = require('fs');

const calcLinePoints = ([x1, y1], [x2, y2]) => {
  const coordinatesArray = [];

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = (x1 < x2) ? 1 : -1;
  const sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;
  let x = x1;
  let y = y1;

  coordinatesArray.push([x, y]);

  while (!((x === x2) && (y === y2))) {
    const e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
    coordinatesArray.push([x, y]);
  }
  return coordinatesArray;
};

const calcBoldPoints = ([x1, y1]) => [
  [x1 - 1, y1 - 1],
  [x1, y1 - 1],
  [x1 + 1, y1 - 1],
  [x1 - 1, y1],
  [x1, y1],
  [x1 + 1, y1],
  [x1 - 1, y1 + 1],
  [x1, y1 + 1],
  [x1 + 1, y1 + 1],
];


const bitsArrayToJpeg = (path, bits, width, height, nodes) => {
  const pixels = bits.reduce(
    (res, bit, i) => {
      res.set(bit === 1 ? [0, 0, 0, 255] : [255, 255, 255, 255], i * 4);
      return res;
    },
    new Uint8Array(bits.length * 4),
  );

  if (nodes) {
    nodes.reduce((previous, current) => {
      if (previous) {
        calcLinePoints(previous, current).forEach(([x, y]) => {
          pixels[(x + (y * width)) * 4] = 255;
          pixels[((x + (y * width)) * 4) + 1] = 0;
          pixels[((x + (y * width)) * 4) + 2] = 0;
        });
      }
      calcBoldPoints(current).forEach(([x, y]) => {
        pixels[(x + (y * width)) * 4] = 0;
        pixels[((x + (y * width)) * 4) + 1] = 0;
        pixels[((x + (y * width)) * 4) + 2] = 255;
      });
      return current;
    }, null);
  }

  fs.writeFile(path, jpeg.encode({
    data: pixels,
    width,
    height,
  }, 100).data);
};

module.exports = bitsArrayToJpeg;
