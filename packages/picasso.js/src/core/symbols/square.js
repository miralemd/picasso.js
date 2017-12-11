/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 */
export default function square(options) {
  const size = options.size;

  return {
    type: 'rect',
    fill: 'black',
    x: options.x - (size / 2),
    y: options.y - (size / 2),
    width: size,
    height: size
  };
}
