# path-from-image

> Try to find the shortest path between two points of an image, following pixels matching a given colors pattern. Usefull to find the shortest path between two locations on a map, by following roads.

## Installation

```shell
npm install --save path-from-image
```

## Basic usage
Let's consider the following image:

![](https://olivierlando.github.io/path-from-image/map-start-end.jpg)

Our goal is to find the shortest path from the blue point to the red one, following the mauve / pink roads.
Here is how to do that :


```js
const fs = require('fs');
const jpeg = require('jpeg-js');
const PathFromImage = require('path-from-image');

const bluePointCoords = [62, 413];
const redPointCoords = [514, 39];

const image = jpeg.decode(fs.readFileSync('road.jpg'), true);
const pathFromImage = new PathFromImage({
  width: image.width,
  height: image.height,
  imageData: image.data,
  colorPatterns: [{ r: [60, 255], g: [0, 70], b: [60, 255] }], // description of the mauve / ping color
});
const path = pathFromImage.path(bluePointCoords, redPointCoords); // => [[62, 413], [63, 406], [69, 390], ...]
```

`path` holds the list of coordinates that connect the blue points to the red one. These points are represented in blue on the following image :

![](https://olivierlando.github.io/path-from-image/map-path.jpg)

##TODO

- add comments :)
- document all options
- improve perfs