import { default as extend } from 'extend';
import { resolveStyle } from '../style';

export default function resolveInitialSettings(settings, defaults, composer, rootPath) {
  const resolvers = {};
  const composition = extend(true, {}, settings);
  Object.keys(defaults).forEach((s) => {
    const ext = rootPath && composition[rootPath] ? composition[rootPath][s] : composition[s];
    if (ext) {
      // Check each setting for the existance of a source without custom function
      Object.keys(ext).forEach((a) => {
        if ((ext[a].source || ext[a].scale) && !ext[a].fn) {
          const scale = composer.scale(ext[a]);
          if (scale) {
            ext[a] = scale;
          }
        } else if (ext[a].fn) {
          ext[a] = ext[a].fn;
        }
      });
    }
    resolvers[s] = resolveStyle(defaults[s], composition, rootPath ? `${rootPath}.${s}` : `${s}`);
  });
  return resolvers;
}
