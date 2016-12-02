import extend from 'extend';
import { resolveStyle } from '../style';

export default function resolveSettingsForPath(settings, defaults, composer, path) {
  const composition = extend(true, {}, settings);
  // Check each setting for the existance of a source without custom function
  const ext = path ? composition[path] : composition;
  const defs = path ? defaults[path] : defaults;
  if (ext) {
    Object.keys(ext).forEach((a) => {
      if (ext[a]) {
        if ((ext[a].source || ext[a].scale) && !ext[a].fn) {
          const scale = composer.scale(ext[a]);
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
