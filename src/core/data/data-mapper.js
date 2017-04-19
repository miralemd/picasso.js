import extend from 'extend';

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

const unfilteredReducers = {
  sum: values => values.reduce((a, b) => a + b, 0)
};

function isPrimitive(x) {
  const type = typeof x;
  return (type !== 'object' && type !== 'function');
}

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

/**
 * @private
 */
// loop through all values from a given field and collect the unique values based on the specified attribute
export function collectRepeating(repeater, ds) {
  const collection = []; // keep track of order
  const ids = {};

  let fieldValues = [];
  let singleGroup;
  const idAttribute = repeater ? repeater.trackBy || 'id' : 'id';
  const dataSource = repeater ? ds.findField(repeater.source) : null;
  if (dataSource && dataSource.field) {
    fieldValues = dataSource.field.values();
    for (let i = 0, id, len = fieldValues.length; i < len; i++) {
      id = idAttribute === '$index' ? i : fieldValues[i][idAttribute];
      if (!ids[id]) {
        ids[id] = {};
        collection.push(ids[id]);
      }
    }
  } else if (typeof repeater === 'undefined') {
    singleGroup = {};
    collection.push(singleGroup);
  }

  return {
    others: singleGroup,
    collection,
    fieldValues,
    ids,
    trackBy: idAttribute
  };
}

/**
 * [collectValues description]
 * @param  {String} key        [description]
 * @param  {String} pool       [description]
 * @param  {String} values     [description]
 * @param  {String} syncValues [description]
 * @param  {String} type       [description]
 * @param  {String} attr       [description]
 * @param  {String} source     [description]
 * @private
 * @return {String}            [description]
 */
// export function collectValues(key, pool, values, syncValues, type, attr, source) {
export function collectValues({
  key, pool, values, syncValues, type, trackBy, source, valueProperty, others
}) {
  const len = values.length;
  let v;
  let i;
  let group;
  for (i = 0; i < len; i++) {
    v = values[i];
    group = syncValues[i] ? pool[trackBy === '$index' ? i : syncValues[i][trackBy]] : others;
    if (group) {
      if (!group[key]) {
        group[key] = {
          _values: [],
          source: {
            field: source,
            type,
            indices: []
          }
        };
      }
      if (valueProperty === '$index') {
        group[key]._values.push(typeof v.index !== 'undefined' ? v.index : i);
      } else {
        group[key]._values.push(v[valueProperty]);
      }
      group[key].source.indices.push(i);
    }
  }
}

/**
 * [collectMapping description]
 * @param  {String} key       [description]
 * @param  {String} m         [description]
 * @param  {String} repeating [description]
 * @param  {String} ds        [description]
 * @private
 * @return {String}           [description]
 */
export function collectMapping(key, m, repeating, ds, collector = collectValues) {
  const ff = ds.findField(m.source); // , ds.tables());
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
  let valueProperty = type === 'qual' ? 'label' : 'value';
  if (m.property) {
    valueProperty = m.property;
  }

  if (m.linkFrom) {
    const link = ds.findField(m.linkFrom);// , ds.tables());
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
    trackBy: repeating.trackBy,
    source: m.source,
    valueProperty,
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
      v[key].value = reducerFn(v[key]._values);
      // delete v[key].values;
    }
  }
}

/**
 * [mapData description]
 * @param  {String} mapper   [description]
 * @param  {String} repeater [description]
 * @param  {String} ds       [description]
 * @return {String}          [description]
 */
export function mapData(mapper, repeater, ds) {
  const collected = collectRepeating(repeater, ds);

  let mapping = mapper;

  if (typeof repeater !== 'undefined') {
    mapping = extend(true, {}, mapper, {
      self: {
        source: repeater.source,
        property: repeater.property || 'label',
        trackBy: repeater.trackBy || repeater.property || 'label',
        reducer: 'first',
        type: 'qual' // TODO - configurable?
      }
    });
  }

  Object.keys(mapping).forEach((key) => {
    const m = mapping[key];
    if (isPrimitive(m)) {
      collected.collection.forEach((c) => {
        c[key] = {
          value: m
        };
      });
    } else {
      collectMapping(key, m, collected, ds);
      reduceValues(key, collected.collection, m.reducer);
    }
  });
  return collected.collection;
}
