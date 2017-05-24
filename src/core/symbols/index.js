import circle from './circle';
import diamond from './diamond';
import saltire from './saltire';
import square from './square';
import triangle from './triangle';
import line from './line';
import star from './star';
import nPolygon from './n-polygon';
import cross from './cross';
import bar from './bar';
import { registry } from '../utils/registry';

const reg = registry();

reg.add('circle', circle);
reg.add('diamond', diamond);
reg.add('saltire', saltire);
reg.add('square', square);
reg.add('triangle', triangle);
reg.add('line', line);
reg.add('star', star);
reg.add('n-polygon', nPolygon);
reg.add('cross', cross);
reg.add('bar', bar);

function createRectCollider({ x, y, size }) {
  const r = size / 2;
  return {
    type: 'rect',
    x: x - r,
    y: y - r,
    width: size,
    height: size
  };
}

function applyStyle(obj, style = {}) {
  const styleProps = ['fill', 'stroke', 'strokeWidth', 'opacity', 'strokeDasharray'];
  Object.keys(style).forEach((key) => {
    if (styleProps.indexOf(key) !== -1) {
      obj[key] = style[key];
    }
  });
}

/**
 * Factory function for symbols.
 * Options object is passed to symbols function.
 * @param {Object} options
 * @param {string} options.type - Type of symbol
 * @param {number} options.x - x-coordinate
 * @param {number} options.y - y-coordinate
 */
export default function create(options = {}) {
  const fn = reg.get(options.type);
  if (fn) {
    const s = fn(options);
    if (!s.collider) {
      s.collider = createRectCollider(options);
    }
    applyStyle(s, options);
    return s;
  }
  return fn;
}

const symbols = {
  add: (type, fn) => reg.add(type, fn),
  get: type => reg.get(type),
  remove: type => reg.remove(type),
  create
};

export { symbols };
