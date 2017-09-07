
const patternMatch = (pattern, r, g, b) =>
  pattern.r[0] <= r && pattern.r[1] >= r &&
  pattern.g[0] <= g && pattern.g[1] >= g &&
  pattern.b[0] <= b && pattern.b[1] >= b;

const patternsMatch = (patterns, r, g, b) =>
  patterns.reduce(
    (res, pattern) =>
      res || patternMatch(pattern, r, g, b),
    false,
  );

const pixelsColorFilter = (patterns, pixels) => {
  const result = new Uint8Array(pixels.length / 4);
  for (let i = 0; i < pixels.length; i += 4) {
    result[i / 4] =
      patternsMatch(patterns, pixels[i], pixels[i + 1], pixels[i + 2]) ? 1 : 0;
  }
  return result;
};

module.exports = pixelsColorFilter;
