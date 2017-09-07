/* eslint-env mocha */
const { expect } = require('chai');
const pixelsColorFilter = require('../dist/PixelsColorFilter');

describe('#getBytesArray()', () => {
  it('should work with one pattern', () => {
    const colorPatterns = [{ r: [200, 255], g: [0, 50], b: [0, 50] }];

    const bitsArray = pixelsColorFilter(colorPatterns, new Uint8Array([
      255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

    expect(Array.from(bitsArray)).to.deep.equal([1, 1, 1, 0, 0, 0, 0, 0, 0]);
  });

  it('should work with two patterns', () => {
    const colorPatterns = [
      { r: [200, 255], g: [0, 50], b: [0, 50] },
      { r: [0, 50], g: [0, 50], b: [200, 255] },
    ];

    const bitsArray = pixelsColorFilter(colorPatterns, new Uint8Array([
      255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 3, 10, 220, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

    expect(Array.from(bitsArray)).to.deep.equal([1, 1, 1, 0, 0, 1, 0, 0, 0]);
  });
});
