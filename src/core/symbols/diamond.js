import { pointsToPath } from '../utils/shapes';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 */
export default function diamond(options) {
  const size = options.size;
  const left = options.x - (size / 2);
  const top = options.y - (size / 2);
  const points = [
    { x: left, y: top + (size / 2) },
    { x: left + (size / 2), y: top },
    { x: left + size, y: top + (size / 2) },
    { x: left + (size / 2), y: top + size },
    { x: left, y: top + (size / 2) }
  ];

  return {
    type: 'path',
    fill: 'black',
    d: pointsToPath(points)
  };
}
