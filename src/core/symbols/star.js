import { pointsToPath } from '../utils/shapes';
import { toRadians } from '../utils/math';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {number} [param.points=5] - Number of points on the star
 * @param {number} [param.startAngle=90] - Start drawing angle
 * @param {number} [param.innerRadius=size/2] - Size of the star core. My not exceed size of symbol.
 */
export default function star(options) {
  const size = options.size;
  const points = [];
  const outerRadius = size / 2;
  const drawPoints = options.points || 5;
  const innerRadius = (Math.min(options.innerRadius || size / 2, size) / 2);
  const startAngle = isNaN(options.startAngle) ? 90 : options.startAngle;
  const angle = 360 / drawPoints;

  for (let i = 1; i <= drawPoints; i++) {
    const pAngle = (angle * i) + startAngle;
    const radians = toRadians(pAngle);
    const innerRadians = toRadians(pAngle + (angle / 2));
    const y = Math.sin(radians);
    const x = Math.cos(radians);
    const iy = Math.sin(innerRadians);
    const ix = Math.cos(innerRadians);

    points.push({
      x: options.x + (x * outerRadius),
      y: options.y + (y * outerRadius)
    });

    points.push({
      x: options.x + (ix * innerRadius),
      y: options.y + (iy * innerRadius)
    });
  }

  return {
    type: 'path',
    stroke: 'black',
    strokeWidth: 1,
    fill: 'yellow',
    d: pointsToPath(points)
  };
}

