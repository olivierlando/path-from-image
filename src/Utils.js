
class Utils {
  /**
   * Determine the square of the distance between 2 points
   * @param {[number, number]} x, y coordinates of the 1st point
   * @param {[number, number]} x, y coordinates of the 2nd point
   */
  static getSquareDistance([x1, y1], [x2, y2]) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return (dx ** 2) + (dy ** 2);
  }
}

module.exports = Utils;
