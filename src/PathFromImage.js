const zhangSuen = require('zhang-suen');
const path = require('path');

const pixelsColorFilter = require('./PixelsColorFilter');
const bitsArrayToJpeg = require('./BitsArrayToJpeg');
const lightenPixelsCount = require('./LightenPixelsCount');
const generateGraph = require('./GenerateGraph');
const Utils = require('./Utils');
const simplify = require('simplify-js');

class PathFromImage {
  constructor(params) {
    const defaultParams = {
      debugJpeg: null,
      dijkstraDistancesExponent: 3,
      stepsDuration: {},
    };

    this.params = { ...defaultParams, ...params };

    if (!params.imageData) throw new Error('Missing imageData parameter');
    if (!params.width) throw new Error('Missing width parameter');
    if (!params.height) throw new Error('Missing height parameter');
    if (!params.colorPatterns) throw new Error('Missing colorPatterns parameter');

    this.reinitStepTime();
    this.bitsArray = pixelsColorFilter(params.colorPatterns, params.imageData);
    this.calcStepTime('pixelsColorFilter');

    if (this.params.debugJpeg) {
      this.reinitStepTime();
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '0-bitsArray.jpg'), this.bitsArray, this.params.width, this.params.height);
      this.calcStepTime('bitsArrayToJpeg');
    }

    this.reinitStepTime();
    this.bitsArray = zhangSuen(this.bitsArray, this.params.width, this.params.height);
    this.calcStepTime('zhangSuen');

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '1-zhangSuen.jpg'), this.bitsArray, this.params.width, this.params.height);
    }

    this.reinitStepTime();
    this.bitsArray = lightenPixelsCount(this.bitsArray, this.params.width, this.params.height);
    this.calcStepTime('lightenPixelsCount');

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '2-lightenPixelsCount.jpg'), this.bitsArray, this.params.width, this.params.height);
    }

    this.reinitStepTime();
    this.graph = generateGraph(
      this.bitsArray,
      this.params.width,
      this.params.height,
      this.params.dijkstraDistancesExponent,
    );
    this.calcStepTime('generateGraph');
  }

  reinitStepTime() {
    this.stepsDurationTime = new Date().getTime();
  }

  calcStepTime(step) {
    if (this.params.stepsDuration) {
      this.params.stepsDuration[step] = new Date().getTime() - this.stepsDurationTime;
    }
  }

  static coordinatesFromNodeName(name, height) {
    return [parseInt(name / height, 10), name % height];
  }

  findClosestPoint(x, y) {
    if (!this.graph) {
      return null;
    }

    let bestPoint = null;
    let bestDistance = Infinity;

    this.graph.graph.forEach((_, nodeName) => {
      const distance = Utils.getSquareDistance(
        [x, y],
        PathFromImage.coordinatesFromNodeName(nodeName, this.params.height),
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPoint = nodeName;
      }
    });
    return bestPoint;
  }

  path([x1, y1], [x2, y2], tolerance) {
    this.reinitStepTime();
    const fullPath = this.graph.path(this.findClosestPoint(x1, y1), this.findClosestPoint(x2, y2));
    this.calcStepTime('path');

    if (fullPath === null) {
      return null;
    }

    this.reinitStepTime();
    const pathCoordinates = fullPath.map(name =>
      PathFromImage.coordinatesFromNodeName(name, this.params.height));
    this.calcStepTime('coordinatesFromNodeName');

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(
        path.join(this.params.debugJpeg, '3-fullPath.jpg'),
        this.bitsArray,
        this.params.width,
        this.params.height,
        pathCoordinates,
      );
    }

    this.reinitStepTime();
    const simplified = simplify(
      pathCoordinates.map(([x, y]) => ({ x, y })),
      tolerance || 5,
      false,
    ).map((({ x, y }) => [x, y]));
    this.calcStepTime('simplify');

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '4-simplifiedPath.jpg'), this.bitsArray, this.params.width, this.params.height, simplified);
    }
    return simplified;
  }
}

module.exports = PathFromImage;
