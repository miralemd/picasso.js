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

