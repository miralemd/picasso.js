/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 */
export default function circle(options) {
  return {
    type: 'circle',
    fill: 'black',
    cx: options.x,
    cy: options.y,
    r: options.size / 2,
    collider: {
      type: 'circle'
    }
  };
}
