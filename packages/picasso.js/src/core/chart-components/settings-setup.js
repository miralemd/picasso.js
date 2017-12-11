import extend from 'extend';
import { resolveStyle } from '../style';

export default function resolveSettingsForPath(settings, defaults, chart, path) {
  const composition = extend(true, {}, settings);
  // Check each setting for the existance of a source without custom function
  const ext = path ? composition[path] : composition;
  const defs = path ? defaults[path] : defaults;
  if (ext) {
    Object.keys(ext).forEach((a) => {
      if (ext[a]) {
        if ((ext[a].source || ext[a].scale) && !ext[a].fn) {
          const scale = chart.scale(ext[a]);
          if (scale) {
            ext[a] = scale;
          }
        } else if (ext[a].fn) {
          ext[a] = ext[a].fn;
        }
      }
    });
  }
  return resolveStyle(defs, composition, path);
}

function isPrimitive(x) {
  const type = typeof x;
  return type !== 'object' && type !== 'function' && type !== 'undefined';
}

export function resolveSettings(settings, defaults, chart) {
  const composition = extend(true, {}, settings);
  const ext = composition;
  const defs = defaults;
  if (ext) {
    Object.keys(composition).forEach((a) => {
      if (a in ext && !isPrimitive(ext[a])) {
        const obj = ext[a];
        ext[a] = {};
        if (typeof obj === 'function') {
          ext[a] = obj;
        } else if (obj.fn) {
          ext[a] = obj.fn;
        }
        if (obj.scale) {
          const scale = chart.scale(obj.scale);
          if (scale) {
            ext[a].scale = scale;
          }
        }
        if (obj.ref) {
          ext[a].ref = obj.ref;
        }
        if (obj.type) {
          ext[a] = obj;
        }
      }
    });
  }
  return resolveStyle(defs, ext);
}
