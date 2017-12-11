import { pointsToPath } from '../utils/shapes';

export function generateCrossPoints(x, y, size, barWidth) {
  const r = size / 2;
  const innerLeft = x - (barWidth / 2);
  const innerTop = y - (barWidth / 2);
  const left = x - r;
  const top = y - r;

  return [
    { x: innerLeft, y: innerTop }, // Top
    { x: innerLeft, y: top },
    { x: innerLeft + barWidth, y: top },
    { x: innerLeft + barWidth, y: innerTop }, // Right
    { x: left + size, y: innerTop },
    { x: left + size, y: innerTop + barWidth },
    { x: innerLeft + barWidth, y: innerTop + barWidth }, // Bottom
    { x: innerLeft + barWidth, y: top + size },
    { x: innerLeft, y: top + size },
    { x: innerLeft, y: innerTop + barWidth }, // Left
    { x: left, y: innerTop + barWidth },
    { x: left, y: innerTop }
  ];
}

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {number} [param.width] - Width of the diagonals
 */
export default function cross(options) {
  const x = options.x;
  const y = options.y;
  const r = options.size / 2;
  const width = isNaN(options.width) ? r / 2 : options.width;
  const barWidth = Math.min(width, r);

  const points = generateCrossPoints(x, y, options.size, barWidth);

  return {
    type: 'path',
    fill: 'black',
    d: pointsToPath(points)
  };
}