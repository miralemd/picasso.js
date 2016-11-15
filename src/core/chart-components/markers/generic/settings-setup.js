import { resolveStyle } from '../../../style';
import { default as extend } from 'extend';

export default function resolveInitialSettings(settings, defaults, composer, rootPath) {
  const ret = {};
  const externals = extend({}, settings);
  Object.keys(defaults).forEach((s) => {
    const ext = rootPath ? externals[rootPath][s] : externals[s];
    if (ext) {
      // Check each setting for the existance of a source without custom function
      Object.keys(ext).forEach((a) => {
        if (ext[a].source && !ext[a].fn) {
          const scale = composer.scale(ext[a]);
          if (scale) {
            ext[a] = scale;
          }
        } else if (ext[a].fn) {
          ext[a] = ext[a].fn;
        }
      });
    }
    ret[s] = resolveStyle(defaults[s], externals, rootPath ? `${rootPath}.${s}` : `${s}`);
  });
  return ret;
}
