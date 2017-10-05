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

function normalizeProperties(cfg, dataset, dataProperties, main) {
  const props = {};
  const mainField = main.field || (typeof cfg.field !== 'undefined' ? dataset.field(cfg.field) : null);
  Object.keys(dataProperties).forEach((key) => {
    const pConfig = dataProperties[key];
    const prop = props[key] = {};
    if (['number', 'string', 'boolean'].indexOf(typeof pConfig) !== -1) {
      prop.type = 'primitive';
      prop.value = pConfig;
    } else if (typeof pConfig === 'function') {
      prop.type = 'function';
      prop.value = pConfig;
      prop.field = mainField;
    } else if (typeof pConfig === 'object') {
      if (pConfig.field) {
        prop.type = 'field';
        prop.field = dataset.field(pConfig.field);
        // prop.source = pConfig.field;
        prop.value = prop.field.value;
      } else if (mainField) {
        prop.value = mainField.value;
        prop.field = mainField;
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

/*
example of configuration input
cfg = {
  field: 'State', // the 'top level' values are extracted from field state
  value: d => d.qText, // the value of the output
  props: { // additional data properties ammended to each item
    a: 3, // constant value
    b: d => d.qElemNumber, // function will receive the original field value
    c: {
      field: 'Country', // reference to another field
      value: d => d.qText // extract the qText value from the referenced field
    },
    d: {
      value: d => d.qRow //  extract qRow from field 'State'
    }
  }
}

// output
[{
  value: 'CA', source: { field: 'State' },
  a: { value: 3 },
  b: { value: 26, source: 'State' },
  c: { value: 'USA', source: 'Country' },
  d: { value: 131, source: 'State' }
},
...]
*/
export function getPropsInfo(cfg, dataset) {
  const { main } = normalizeProperties(cfg, dataset, { main: { value: cfg.value, reduce: cfg.reduce } }, {});
  const props = normalizeProperties(cfg, dataset, cfg.props || {}, main);
  return { props, main };
}

