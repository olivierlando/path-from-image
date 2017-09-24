const Graph = require('node-dijkstra');
const Utils = require('./Utils');

const isBlack = (data, x, y, width) => data[x + (y * width)] === 1;

const anglesDistance = (alpha, beta) => {
  const phi = Math.abs(beta - alpha) % 360;
  const distance = phi > 180 ? 360 - phi : phi;
  return distance;
};

const generateGraph = (data, width, height, exponent) => {
  const minDist = 2;
  const maxDist = 40;
  const simpleGraph = {};

  const getPointName = (x, y) => (x * height) + y;


  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      if (isBlack(data, x, y, width)) {
        const neighbours = [];
        for (let xx = Math.max(0, x - maxDist); xx < Math.min(width - 1, x + maxDist); xx += 1) {
          for (let yy = Math.max(0, y - maxDist); yy < Math.min(height - 1, y + maxDist); yy += 1) {
            if (isBlack(data, xx, yy, width)) {
              const squareDistance = Utils.getSquareDistance([x, y], [xx, yy]);
              if (squareDistance >= (minDist ** 2) && squareDistance < (maxDist ** 2)) {
                neighbours.push({
                  point: getPointName(xx, yy),
                  distance: squareDistance ** exponent,
                  angle: (Math.atan2(yy - y, xx - x) * 180) / Math.PI,
                });
              }
            }
          }
        }
        if (neighbours.length > 0) {
          simpleGraph[getPointName(x, y)] = neighbours;
        }
      }
    }
  }
  const nodes = Object.keys(simpleGraph);
  const graph = new Graph();

  nodes.forEach((node) => {
    const neighbours = simpleGraph[node];
    const toKeep = {};
    neighbours.forEach((neighbour) => {
      const best = neighbours.find(otherNeighbour =>
        Math.abs(anglesDistance(otherNeighbour.angle, neighbour.angle)) < 25 &&
          otherNeighbour.distance < neighbour.distance);

      if (best === undefined) {
        toKeep[neighbour.point] = neighbour.distance;
      }
    });
    graph.addNode(node, toKeep);
  });

  return graph;
};

module.exports = generateGraph;
