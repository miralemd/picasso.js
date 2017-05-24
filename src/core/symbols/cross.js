/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 */
export default function cross(options) {
  const r = options.size / 2;
  const x = options.x;
  const y = options.y;

  return {
    type: 'path',
    stroke: 'black',
    strokeWidth: r / 2,
    d: `M ${x - r} ${y} L ${x + r} ${y} M ${x} ${y + r} L ${x} ${y - r}`
  };
}
