
const reducers = { // TODO - handle null values
  first: values => values[0],
  last: values => values[values.length - 1],
  min: values => Math.min(...values),
  max: values => Math.max(...values),
  sum: values => values.reduce((a, b) => a + b, 0),
  avg: (values) => {
    const len = values.length;
    return reducers.sum(values) / len;
  }
};

export function findField(path, tables) {
  let table = tables.filter(t => path.indexOf(t.id()) === 0)[0];
  let field;
  if (table) {
    let subpath = path.replace(table.id(), '');
    field = table.findField(subpath);
  }
  return {
    table,
    field
  };
}

function collectRepeating(repeater, ds) {
  let collection = [];
  let ids = {};
  let fieldValues = [];
  let singleGroup;
  let idAttribute = repeater ? repeater.attribute || 'id' : 'id';
  let gg = repeater ? ds.findField(repeater.field) : null;
  if (gg && gg.field) {
    fieldValues = gg.field.values();
    fieldValues.forEach((v, i) => {
      let id = idAttribute === '$index' ? i : v[idAttribute];
      if (!ids[id]) {
        ids[id] = {};
        collection.push(ids[id]);
      }
    });
  } else {
    singleGroup = {};
    collection.push(singleGroup);
  }

  return {
    single: singleGroup,
    collection,
    fieldValues,
    ids,
    attr: idAttribute
  };
}

function collectMapping(key, m, repeating, ds) {
  let ff = findField(m.field, ds.tables());
  let fieldValues = [];
  let syncValues = repeating.fieldValues;
  let type = m.type || 'quant';
  if (ff.field) {
    fieldValues = ff.field.values();
  }
  if (m.linkFrom) {
    let link = findField(m.linkFrom, ds.tables());
    if (link.field) {
      syncValues = link.field.values();
    }
  }

  fieldValues.forEach((v, i) => {
    let g = syncValues[i] ? repeating.ids[repeating.attr === '$index' ? i : syncValues[i][repeating.attr]] : repeating.single;
    if (g) {
      if (!g[key]) {
        g[key] = {
          values: [],
          source: {
            field: m.field,
            indices: []
          }
        };
      }
      g[key].values.push(type === 'qual' ? v.label : v.value);
      g[key].source.indices.push(i);
    }
  });
}

export function mapData(mapper, repeater, ds) {
  let collected = collectRepeating(repeater, ds);

  Object.keys(mapper).forEach((key) => {
    const m = mapper[key];
    collectMapping(key, m, collected, ds);

    let collection = collected.collection;
    const len = collection.length;
    let v;
    let reducerFn;
    for (let i = 0; i < len; i++) {
      v = collection[i];
      if (v[key]) {
        reducerFn = typeof m.reducer === 'function' ? m.reducer : reducers[m.reducer || 'sum'];
        v[key].value = reducerFn(v[key].values);
        delete v[key].values;
      }
    }
  });
  return collected.single || collected.collection;
}
