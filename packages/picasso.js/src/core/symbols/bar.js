import { rotate } from '../math/vector';
import { pointsToRect } from '../math/intersection';
import { toRadians } from '../utils/math';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 * @param {string} [param.direction='horizontal'] - Direction for bar. Is either horizontal or vertical.
 */
export default function bar(options) {
  const p = { x: options.x, y: options.y };
  const isVertical = options.direction === 'vertical';
  const r = options.size / 2;
  const width = r / 2;
  const halfWidth = width / 2;

  let points = [
    { x: p.x - r, y: p.y + halfWidth },
    { x: p.x - r, y: p.y - halfWidth },
    { x: p.x + r, y: p.y - halfWidth },
    { x: p.x + r, y: p.y + halfWidth }
  ];

  if (isVertical) {
    const radians = toRadians(90);
    points = points.map(pp => rotate(pp, radians, p));
  }

  const rect = pointsToRect(points);
  rect.type = 'rect';
  rect.fill = 'black';
  rect.collider = { type: 'rect' };

  return rect;
}
