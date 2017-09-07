const Graph = require('node-dijkstra');
const Utils = require('./Utils');

const isBlack = (data, x, y, width) => data[x + (y * width)] === 1;

const generateGraph = (data, width, height, exponent) => {
  const graph = new Graph();
  const bound = 30;
  const minDistance = 0;
  const maxDistance = 40 ** 2;

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      if (isBlack(data, x, y, width)) {
        const neighbours = {};

        for (let xx = Math.max(0, x - bound); xx < Math.min(width - 1, x + bound); xx += 1) {
          for (let yy = Math.max(0, y - bound); yy < Math.min(height - 1, y + bound); yy += 1) {
            if (isBlack(data, xx, yy, width)) {
              const distance = Utils.getSquareDistance([x, y], [xx, yy]);
              if (distance > minDistance && distance < maxDistance) neighbours[`${xx}_${yy}`] = distance ** exponent;
            }
          }
        }
        if (Object.keys(neighbours).length > 0) {
          const pointName = `${x}_${y}`;
          graph.addNode(pointName, neighbours);
        }
      }
    }
  }
  return graph;
};

module.exports = generateGraph;
