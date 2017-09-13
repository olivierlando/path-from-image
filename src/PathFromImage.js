const zhangSuen = require('zhang-suen');
const path = require('path');

const pixelsColorFilter = require('./PixelsColorFilter');
const bitsArrayToJpeg = require('./BitsArrayToJpeg');
const lightenPixelsCount = require('./LightenPixelsCount');
const generateGraph = require('./GenerateGraph');
const Utils = require('./Utils');
const douglasPeucker = require('./DouglasPeucker');

class PathFromImage {
  constructor(params) {
    const defaultParams = {
      debugJpeg: null,
      dijkstraDistancesExponent: 3,
    };

    this.params = { ...defaultParams, ...params };

    if (!params.imageData) throw new Error('Missing imageData parameter');
    if (!params.width) throw new Error('Missing width parameter');
    if (!params.height) throw new Error('Missing height parameter');
    if (!params.colorPatterns) throw new Error('Missing colorPatterns parameter');

    this.bitsArray = pixelsColorFilter(params.colorPatterns, params.imageData);

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '0-bitsArray.jpg'), this.bitsArray, this.params.width, this.params.height);
    }

    this.bitsArray = zhangSuen(this.bitsArray, this.params.width, this.params.height);

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '1-zhangSuen.jpg'), this.bitsArray, this.params.width, this.params.height);
    }

    this.bitsArray = lightenPixelsCount(this.bitsArray, this.params.width, this.params.height);

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '2-lightenPixelsCount.jpg'), this.bitsArray, this.params.width, this.params.height);
    }

    this.graph = generateGraph(
      this.bitsArray,
      this.params.width,
      this.params.height,
      this.params.dijkstraDistancesExponent,
    );
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
    const fullPath = this.graph.path(this.findClosestPoint(x1, y1), this.findClosestPoint(x2, y2));

    if (fullPath === null) {
      return null;
    }

    const pathCoordinates = fullPath.map(name =>
      PathFromImage.coordinatesFromNodeName(name, this.params.height));

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(
        path.join(this.params.debugJpeg, '3-fullPath.jpg'),
        this.bitsArray,
        this.params.width,
        this.params.height,
        pathCoordinates,
      );
    }

    const simplified = douglasPeucker(
      pathCoordinates,
      tolerance || 5,
      false,
    );

    if (this.params.debugJpeg) {
      bitsArrayToJpeg(path.join(this.params.debugJpeg, '4-simplifiedPath.jpg'), this.bitsArray, this.params.width, this.params.height, simplified);
    }

    return simplified;
  }
}

module.exports = PathFromImage;
