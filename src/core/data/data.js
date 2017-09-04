import types from './types';

export default function datasets(arr, { logger }) {
  const data = {};

  const sets = [];
  if (!Array.isArray(arr)) {
    logger.warn('Deprecated: "data-source" configuration"');
    sets.push(arr);
  } else {
    sets.push(...arr);
  }

  sets.forEach((d, i) => {
    let t = types(d.type);
    if (t) {
      t = t(d.data, t.config);
      data[d.key || i] = t;
    }
  });

  const fn = (name) => {
    if (name) {
      return data[name];
    }
    return data[Object.keys(data)[0]];
  };
  return fn;
}
