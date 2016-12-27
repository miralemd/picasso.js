import extend from 'extend';

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

const unfilteredReducers = {
  sum: values => values.reduce((a, b) => a + b, 0)
};

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
    return !filtered.length ? NaN : Math.min(...filtered);
  },
  max: (values) => {
    const filtered = filters.numeric(values);
    return !filtered.length ? NaN : Math.max(...filtered);
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

/**
 * @private
 */
// loop through all values from a given field and collect the unique values based on the specified attribute
export function collectRepeating(repeater, ds) {
  let collection = []; // keep track of order
  let ids = {};

  let fieldValues = [];
  let singleGroup;
  let idAttribute = repeater ? repeater.attribute || 'id' : 'id';
  let dataSource = repeater ? ds.findField(repeater.source) : null;
  if (dataSource && dataSource.field) {
    fieldValues = dataSource.field.values();
    fieldValues.forEach((v, i) => {
      let id = idAttribute === '$index' ? i : v[idAttribute];
      if (!ids[id]) {
        ids[id] = {};
        collection.push(ids[id]);
      }
    });
  } else if (typeof repeater === 'undefined') {
    singleGroup = {};
    collection.push(singleGroup);
  }

  return {
    others: singleGroup,
    collection,
    fieldValues,
    ids,
    attr: idAttribute
  };
}

/**
 * [collectValues description]
 * @param  {[type]} key        [description]
 * @param  {[type]} pool       [description]
 * @param  {[type]} values     [description]
 * @param  {[type]} syncValues [description]
 * @param  {[type]} type       [description]
 * @param  {[type]} attr       [description]
 * @param  {[type]} source     [description]
 * @private
 * @return {[type]}            [description]
 */
// export function collectValues(key, pool, values, syncValues, type, attr, source) {
export function collectValues({
  key, pool, values, syncValues, type, attr, source, property, others
}) {
  const len = values.length;
  let v;
  let i;
  let group;
  for (i = 0; i < len; i++) {
    v = values[i];
    group = syncValues[i] ? pool[attr === '$index' ? i : syncValues[i][attr]] : others;
    if (group) {
      if (!group[key]) {
        group[key] = {
          values: [],
          source: {
            field: source,
            type,
            indices: []
          }
        };
      }
      group[key].values.push(v[property]);
      group[key].source.indices.push(i);
    }
  }
}

/**
 * [collectMapping description]
 * @param  {[type]} key       [description]
 * @param  {[type]} m         [description]
 * @param  {[type]} repeating [description]
 * @param  {[type]} ds        [description]
 * @private
 * @return {[type]}           [description]
 */
export function collectMapping(key, m, repeating, ds, collector = collectValues) {
  let ff = ds.findField(m.source); // , ds.tables());
  let fieldValues = [];
  let syncValues = repeating.fieldValues;
  let type = m.type || 'quant';
  let fieldType;
  if (ff.field) {
    fieldValues = ff.field.values();
    fieldType = ff.field.type();
    if (!m.type) {
      type = fieldType === 'dimension' ? 'qual' : 'quant';
    }
  }
  let property = type === 'qual' ? 'label' : 'value';

  if (m.linkFrom) {
    let link = ds.findField(m.linkFrom);// , ds.tables());
    if (link.field) {
      syncValues = link.field.values();
    }
  }

  collector({
    key,
    pool: repeating.ids,
    values: fieldValues,
    syncValues,
    type,
    attr: repeating.attr,
    source: m.source,
    property: type === 'qual:id' ? 'id' : property,
    others: repeating.others
  });
}

function reduceValues(key, values, reducer) {
  const len = values.length;
  let v;
  let reducerFn;
  for (let i = 0; i < len; i++) {
    v = values[i];
    if (v[key]) {
      reducerFn = typeof reducer === 'function' ? reducer : reducers[reducer || 'sum'];
      v[key].value = reducerFn(v[key].values);
      delete v[key].values;
    }
  }
}

/**
 * [mapData description]
 * @param  {[type]} mapper   [description]
 * @param  {[type]} repeater [description]
 * @param  {[type]} ds       [description]
 * @return {[type]}          [description]
 */
export function mapData(mapper, repeater, ds) {
  let collected = collectRepeating(repeater, ds);

  let mapping = mapper;

  if (typeof repeater !== 'undefined') {
    mapping = extend(true, {}, mapper, {
      self: {
        source: repeater.source,
        reducer: 'first',
        type: 'qual'
      }
    });
  }

  Object.keys(mapping).forEach((key) => {
    const m = mapping[key];
    collectMapping(key, m, collected, ds);
    reduceValues(key, collected.collection, m.reducer);
  });
  return collected.collection;
}
