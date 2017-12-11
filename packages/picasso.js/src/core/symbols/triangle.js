import { pointsToPath } from '../utils/shapes';
import { rotate } from '../math/vector';
import { toRadians } from '../utils/math';

const DIRECTION_TO_ANGLE = {
  up: 0,
  down: 180,
  left: 90,
  right: -90
};

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {string} [param.direction='up'] - Available options are up, down, left or right
 */
export default function triangle(options) {
  const size = options.size;
  const p = { x: options.x, y: options.y };
  const directionAngle = DIRECTION_TO_ANGLE[options.direction] || 0;
  const halfSize = (size / 2);
  const left = options.x - halfSize;
  const top = options.y - halfSize;
  let points = [
    { x: left, y: top + size },
    { x: left + halfSize, y: top },
    { x: left + size, y: top + size },
    { x: left, y: top + size }
  ];

  const radians = toRadians(directionAngle);
  points = points.map(pp => rotate(pp, radians, p));

  return {
    type: 'path',
    fill: 'black',
    d: pointsToPath(points)
  };
}
