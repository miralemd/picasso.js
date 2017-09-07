export function findField(query, { cache }) {
  if (typeof query === 'number') {
    return cache.fields[query];
  }

  // Find by title
  for (let i = 0; i < cache.fields.length; i++) {
    if (cache.fields[i].title() === query) {
      return cache.fields[i];
    }
  }
  return null;
}

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

const unfilteredReducers = {
  sum: values => values.reduce((a, b) => a + b, 0)
};

// function isPrimitive(x) {
//   const type = typeof x;
//   return (type !== 'object' && type !== 'function');
// }

/**
 * [reducers description]
 * @type {Object}
 * @private
 */
export const reducers = {
  first: values => values[0],
  last: values => values[values.length - 1],
  min: (values) => {
    const filtered = filters.numeric(values);
    return !filtered.length ? NaN : Math.min.apply(null, filtered);
  },
  max: (values) => {
    const filtered = filters.numeric(values);
    return !filtered.length ? NaN : Math.max.apply(null, filtered);
  },
  sum: (values) => {
    const filtered = filters.numeric(values);
    return !filtered.length ? NaN : filtered.reduce((a, b) => a + b, 0);
  },
  avg: (values) => {
    const filtered = filters.numeric(values);
    const len = filtered.length;
    return !len ? NaN : unfilteredReducers.sum(filtered) / len;
  }
};

function normalizeProperties(cfg, rawData, cache, dataProperties) {
  const props = {};
  Object.keys(dataProperties).forEach((key) => {
    const pConfig = dataProperties[key];

    const prop = props[key] = {};
    if (['number', 'string', 'boolean'].indexOf(typeof pConfig) !== -1) {
      prop.type = 'primitive';
      prop.value = pConfig;
    } else if (typeof pConfig === 'function') {
      prop.type = 'function';
      prop.value = pConfig;
      prop.source = cfg.field;
    } else if (typeof pConfig === 'object') {
      if (pConfig.field) {
        prop.type = 'field';
        prop.field = findField(pConfig.field, { rawData, cache });
        if (!prop.field) {
          throw Error(`Field '${pConfig.field}' not found`);
        }
        prop.source = pConfig.field;
        prop.value = prop.field.value;
      } else {
        prop.source = cfg.field;
        const f = findField(cfg.field, { rawData, cache });
        if (f) {
          prop.value = f.value;
        }
      }
      if (typeof pConfig.value !== 'undefined') {
        prop.value = pConfig.value;
      }
      if (typeof pConfig.reduce === 'function') {
        prop.reduce = pConfig.reduce;
      } else if (pConfig.reduce) {
        prop.reduce = reducers[pConfig.reduce];
      }
    }
  });

  return props;
}

// normalize property mapping config
export function getPropsInfo(cfg, cube, cache) {
  const props = normalizeProperties(cfg, cube, cache, cfg.props || {});
  const { main } = normalizeProperties(cfg, cube, cache, { main: { value: cfg.value } });
  return { props, main };
}

