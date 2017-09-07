
const isBlack = (data, x, y, width) => data[x + (y * width)] === 1;
const isWhite = (data, x, y, width) => data[x + (y * width)] === 0;

const lightenPixelsCount = (data, width, height) => {
  const result = [...data];

  // remove alone pixels
  for (let x = 1; x < width - 1; x += 1) {
    for (let y = 1; y < height - 1; y += 1) {
      if (isBlack(result, x, y, width) &&
        isWhite(result, x - 1, y - 1, width) && isWhite(result, x - 1, y, width) &&
        isWhite(result, x - 1, y + 1, width) && isWhite(result, x, y - 1, width) &&
        isWhite(result, x + 1, y - 1, width) && isWhite(result, x + 1, y, width) &&
        isWhite(result, x + 1, y + 1, width) && isWhite(result, x, y + 1, width)) {
        result[x + (y * width)] = 0;
      }
    }
  }

  for (let x = 0; x < width - 1; x += 2) {
    for (let y = 0; y < height; y += 1) {
      result[x + (y % 2) + (y * width)] = 0;
    }
  }

  return result;
};

module.exports = lightenPixelsCount;
