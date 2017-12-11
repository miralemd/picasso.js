import { generateCrossPoints } from './cross';
import { toRadians } from '../utils/math';
import { rotate } from '../math/vector';
import { pointsToPath } from '../utils/shapes';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {number} [param.width] - Width of the diagonals
 */
export default function saltire(options) {
  const radians = toRadians(45);
  const r = options.size / 2;
  const width = isNaN(options.width) ? r / 2 : options.width;
  const barWidth = Math.min(width, r);
  let adjustedSize = options.size;

  // Adjust for the barwidth and rotation angle, so that the visual part is always inside the symbol area
  const h = Math.sin(Math.asin(-radians)) * (barWidth / 2);
  const c = r / Math.sin(-radians);
  adjustedSize += (c - r) * 2;
  adjustedSize -= h * 2;

  const centroid = { x: options.x, y: options.y };
  const points = generateCrossPoints(options.x, options.y, adjustedSize, barWidth)
    .map(p => rotate(p, radians, centroid));

  return {
    type: 'path',
    fill: 'black',
    d: pointsToPath(points)
  };
}
