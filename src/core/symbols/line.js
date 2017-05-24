/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {string} [param.direction='horizontal'] - Direction for line. Is either horizontal or vertical.
 */
export default function line(options) {
  const isVertical = options.direction === 'vertical';
  const r = options.size / 2;
  const x = options.x;
  const y = options.y;

  return {
    type: 'line',
    stroke: 'black',
    strokeWidth: r / 2,
    x1: x - (isVertical ? 0 : r),
    y1: y - (isVertical ? r : 0),
    x2: x + (isVertical ? 0 : r),
    y2: y + (isVertical ? r : 0)
  };
}
