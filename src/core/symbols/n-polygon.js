import { pointsToPath } from '../utils/shapes';
import { toRadians } from '../utils/math';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {Object} [param.sides=6] - Number of sides on the regular polygon
 * @param {Object} [param.startAngle=0] - Start drawing angle
 */
export default function nPolygon(options) {
  const points = [];
  const radius = options.size / 2;
  const drawPoints = Math.max(isNaN(options.sides) ? 6 : options.sides, 3);
  const angle = 360 / drawPoints;
  const startAngle = isNaN(options.startAngle) ? 0 : options.startAngle;

  for (let i = 1; i <= drawPoints; i++) {
    const radians = toRadians((angle * i) + startAngle);
    const y = Math.sin(radians);
    const x = Math.cos(radians);
    points.push({
      x: options.x + (x * radius),
      y: options.y + (y * radius)
    });
  }

  return {
    type: 'path',
    fill: 'black',
    d: pointsToPath(points)
  };
}

