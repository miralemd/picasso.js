import extend from 'extend';

const VARIABLE_RX = /^\$/;
const EXTEND = '@extend';

function res(style, references, path) {
  const refs = extend({}, references, style);
  const s = {};
  let p = path.slice();
  Object.keys(style).forEach((key) => {
    if (key === EXTEND || VARIABLE_RX.test(key)) {
      return;
    }
    s[key] = style[key];
    let value = s[key];
    if (VARIABLE_RX.test(value) && value in refs) {
      if (path.indexOf(value) !== -1) {
        throw new Error(`Cyclical reference for "${value}"`);
      }
      p.push(value);
      value = refs[value];
      if (typeof value === 'object') {
        if (value[EXTEND]) {
          value = extend({}, refs[value[EXTEND]], value);
        }
        s[key] = res(value, refs, p);
      } else {
        s[key] = value;
      }
    }
  });
  return s;
}

/**
 * Resolve style references
 *
 * @param {style-object} style
 * @param {style-object} references
 * @returns {object} The resolved style
 * @example
 * resolve({
 *   label: '$label--big'
 * }, {
 *   '$size--m': '12px',
 *   '$label--big': {
 *     fontFamily: 'Arial',
 *     fontSize: '$size--m'
 *   }
 * }); // { label: { fontFamily: 'Arial', fontSize: '12px' } }
 */
export default function resolve(style, references) {
  return res(style, references, []);
}
