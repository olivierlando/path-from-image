/* eslint-env mocha */
const { expect } = require('chai');
const PathFromImage = require('../dist/PathFromImage');
const jpeg = require('jpeg-js');
const fs = require('fs');
const path = require('path');

describe('#path()', () => {
  it('should return a path when running against a real world map jpg', () => {
    const jpegData = jpeg.decode(fs.readFileSync(path.join(path.basename(__dirname), 'assets', 'ign.jpg')), true);

    const pathFromImage = new PathFromImage({
      width: jpegData.width,
      height: jpegData.height,
      imageData: jpegData.data,
      colorPatterns: [{ r: [60, 255], g: [0, 70], b: [60, 255] }],
      // debugJpeg: path.join(path.basename(__dirname), 'results'),
    });
    expect(pathFromImage.path([47, 411], [514, 39], 7)).to.be.be.a('array');
  });
});
