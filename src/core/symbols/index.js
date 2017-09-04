import { mappedAttributes } from '../scene-graph//attributes';
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
import registry from '../utils/registry';

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

function applyOpts(obj, opts = {}) {
  Object.keys(opts).forEach((key) => {
    if (typeof mappedAttributes[key] !== 'undefined' && key !== 'transform') {
      obj[key] = opts[key];
    }
  });
}

/**
 * Factory function for symbols.
 * Options object is passed to symbols function.
 * @param {Object} options - Options definition may contain any of the supported display-object attributes
 * @param {string} options.type - Type of symbol
 * @param {number} options.x - x-coordinate
 * @param {number} options.y - y-coordinate
 * @param {number} options.size
 * @param {object} [options.data]
 */
export default function create(options = {}) { // TODO handle reserverd properties x, y, size, data, etc..
  const fn = reg.get(options.type);
  if (fn) {
    const s = fn(options);
    if (!s.collider) {
      s.collider = createRectCollider(options);
    }

    applyOpts(s, options);

    if (typeof options.data !== 'undefined') {
      s.data = options.data;
    }

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
