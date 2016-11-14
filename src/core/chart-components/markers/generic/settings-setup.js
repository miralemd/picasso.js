import { resolveStyle } from '../../../style';

export function resolveInitialSettings(settings, defaults, composer, rootPath) {
  let ret = {};
  for (let s in defaults) {
    if (settings[s]) {
      for (let a in settings[s]) {
        if (settings[s][a].source && !settings[s][a].fn) {
          const scale = composer.scale(settings[s][a]);
          if (scale) {
            settings[s][a].fn = scale;
          }
        }
      }
    }
    ret[s] = resolveStyle(defaults[s], settings, `${rootPath}.${s}`);
  }
  return ret;
}
