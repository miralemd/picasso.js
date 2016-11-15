import { resolveStyle } from '../../../style';

export default function resolveInitialSettings(settings, defaults, composer, rootPath) {
  const ret = {};
  const externals = settings || {};
  Object.keys(defaults).forEach((s) => {
    if (externals[s]) {
      // Check each setting for the existance of a source without custom function
      Object.keys(externals[s]).forEach((a) => {
        if (externals[s][a].source && !externals[s][a].fn) {
          const scale = composer.scale(externals[s][a]);
          if (scale) {
            externals[s][a].fn = scale;
          }
        }
      });
    }
    ret[s] = resolveStyle(defaults[s], settings, `${rootPath}.${s}`);
  });
  return ret;
}
