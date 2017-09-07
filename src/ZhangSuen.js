/*
 * Implementation of the Zhang-Suen algorithm.
 * This algorithm is used to thin a one bit per pixel image
 */


/**
 * Returns the index in the linear bits array from x & y coordinates
 * @param {number} width image width
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 */
const getIndexFromCoordinates = (width, x, y) => (x + (y * width));


/**
 * The following function returns the p1, p2, ... p9 pixel value,
 * according to the following pixels map:
 *  P9  P2  P3
 *  P8  P1  P4
 *  P7  P6  P5
 * @param {uint8Array} data image data (array of 0 and 1, 1: black, 0: white)
 * @param {number} width image width
 * @param {number} x x coordinate of P1
 * @param {number} y y coordinate of P1
 */

const p1 = (data, width, x, y) => data[getIndexFromCoordinates(width, x, y)];
const p2 = (data, width, x, y) => data[getIndexFromCoordinates(width, x, y - 1)];
const p3 = (data, width, x, y) => data[getIndexFromCoordinates(width, x + 1, y - 1)];
const p4 = (data, width, x, y) => data[getIndexFromCoordinates(width, x + 1, y)];
const p5 = (data, width, x, y) => data[getIndexFromCoordinates(width, x + 1, y + 1)];
const p6 = (data, width, x, y) => data[getIndexFromCoordinates(width, x, y + 1)];
const p7 = (data, width, x, y) => data[getIndexFromCoordinates(width, x - 1, y + 1)];
const p8 = (data, width, x, y) => data[getIndexFromCoordinates(width, x - 1, y)];
const p9 = (data, width, x, y) => data[getIndexFromCoordinates(width, x - 1, y - 1)];

/**
 * Determine the number of black neightboors of a pixel
 * @param {uint8Array} data image data (array of 0 and 1, 1: black, 0: white)
 * @param {number} width image width
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 */
const neighbours = (data, width, x, y) =>
  p2(data, width, x, y) + p3(data, width, x, y) +
  p4(data, width, x, y) + p5(data, width, x, y) +
  p6(data, width, x, y) + p7(data, width, x, y) +
  p8(data, width, x, y) + p9(data, width, x, y);

/**
 * Determine the number of transitions from white to black in the sequence
 * p2 -> p3 -> p4 -> p5 -> p6 -> p7 -> p8 -> p9 -> p2
 * @param {uint8Array} data image data (array of 0 and 1, 1: black, 0: white)
 * @param {number} width image width
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 */
const transitions = (data, width, x, y) => {
  let result = 0;
  if (p2(data, width, x, y) === 0 && p3(data, width, x, y) === 1) result += 1;
  if (p3(data, width, x, y) === 0 && p4(data, width, x, y) === 1) result += 1;
  if (p4(data, width, x, y) === 0 && p5(data, width, x, y) === 1) result += 1;
  if (p5(data, width, x, y) === 0 && p6(data, width, x, y) === 1) result += 1;
  if (p6(data, width, x, y) === 0 && p7(data, width, x, y) === 1) result += 1;
  if (p7(data, width, x, y) === 0 && p8(data, width, x, y) === 1) result += 1;
  if (p8(data, width, x, y) === 0 && p9(data, width, x, y) === 1) result += 1;
  if (p9(data, width, x, y) === 0 && p2(data, width, x, y) === 1) result += 1;
  return result;
};

/**
 * Implementation of the Zhang-Suen algorithm
 * @param {uint8Array} data image data (array of 0 and 1, 1: black, 0: white)
 * @param {number} width image width
 * @param {number} height image height
 */
const zhangSuen = (data, width, height) => {
  const result = [...data];
  let white = [];
  let isLastStep;

  do {
    isLastStep = true;
    for (let x = 1; x < width - 1; x += 1) {
      for (let y = 1; y < height - 1; y += 1) {
        if ((p1(result, width, x, y) === 1) &&
            (neighbours(result, width, x, y) >= 2 && neighbours(result, width, x, y) <= 6) &&
            (transitions(result, width, x, y) === 1) &&
            (p2(result, width, x, y) === 0 ||
              p4(result, width, x, y) === 0 ||
              p6(result, width, x, y) === 0) &&
            (p4(result, width, x, y) === 0 ||
              p6(result, width, x, y) === 0 ||
              p8(result, width, x, y) === 0)) {
          white.push([x, y]);
        }
      }
    }
    if (white.length > 0) isLastStep = false;
    white.forEach((p) => {
      result[getIndexFromCoordinates(width, p[0], p[1])] = 0;
    });

    white = [];
    for (let x = 1; x < width - 1; x += 1) {
      for (let y = 1; y < height - 1; y += 1) {
        if ((p1(result, width, x, y) === 1) &&
            (neighbours(result, width, x, y) >= 2 && neighbours(result, width, x, y) <= 6) &&
            (transitions(result, width, x, y) === 1) &&
            (p2(result, width, x, y) === 0 ||
              p4(result, width, x, y) === 0 ||
              p8(result, width, x, y) === 0) &&
            (p2(result, width, x, y) === 0 ||
              p6(result, width, x, y) === 0 ||
              p8(result, width, x, y) === 0)) {
          white.push([x, y]);
        }
      }
    }
    if (white.length > 0) isLastStep = false;
    white.forEach((p) => {
      result[getIndexFromCoordinates(width, p[0], p[1])] = 0;
    });
    white = [];
  } while (!isLastStep);

  return result;
};


module.exports = zhangSuen;
