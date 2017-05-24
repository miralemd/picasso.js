import { toRadians } from '../utils/math';

/**
 * Generator function for symbol
 * @param {Object} param
 * @param {Object} param.p - Point for centroid of symbol
 * @param {number} param.p.x - x-coordinate
 * @param {number} param.p.y - y-coordinate
 * @param {number} param.size - Size in square area
 */
export default function saltire(options) {
  const r = options.size / 2;
  options.strokeWidth = Math.min(isNaN(options.strokeWidth) ? r / 2 : options.strokeWidth, r);
  const h = -Math.sin(Math.asin(toRadians(45))) * (options.strokeWidth / 2); // Adjust for the with of the stroke, so that the visual stroke is always inside the symbol area
  const left = (options.x - r) + h;
  const top = (options.y - r) + h;
  const adjustedSize = options.size - (h * 2);

  return {
    type: 'path',
    stroke: 'black',
    strokeWidth: options.strokeWidth,
    d: `M ${left} ${top} l ${adjustedSize} ${adjustedSize} M ${left} ${top + adjustedSize} l ${adjustedSize} -${adjustedSize}`
  };
}
