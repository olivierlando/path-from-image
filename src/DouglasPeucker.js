const Utils = require('./Utils');

const getSegmentDistance = (p, p1, p2) => {
  let [x, y] = [p1[0], p1[1]];
  let dx = p2[0] - x;
  let dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = (((p[0] - x) * dx) + ((((p[1] - y) * dy)) / ((dx * dx) + (dy * dy))));

    if (t > 1) {
      [x, y] = [p2[0], p2[1]];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return (dx * dx) + (dy * dy);
};

const simplifyRadialDistance = (points, sqTolerance) => {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point;

  for (let i = 1, len = points.length; i < len; i += 1) {
    point = points[i];

    if (Utils.getSquareDistance(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) newPoints.push(point);

  return newPoints;
};

const simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
  let maxSqDist = sqTolerance;
  let index;

  for (let i = first + 1; i < last; i += 1) {
    const sqDist = getSegmentDistance(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
};


const simplifyDouglasPeucker = (points, sqTolerance) => {
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);

  return simplified;
};


const simplify = (points, tolerance, highestQuality) => {
  if (points.length <= 2) return points;
  let result = [...points];

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
  result = highestQuality ? result : simplifyRadialDistance(result, sqTolerance);
  result = simplifyDouglasPeucker(result, sqTolerance);

  return result;
};

module.exports = simplify;
