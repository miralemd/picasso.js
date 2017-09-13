function flattenTree(children, steps, prop, arrIndexAtTargetDepth) {
  const arr = [];
  if (steps <= 0) {
    const nodes = arrIndexAtTargetDepth >= 0 ? [children[arrIndexAtTargetDepth]] : children;
    if (prop) {
      arr.push(...nodes.map(v => v[prop]));
    } else {
      arr.push(...nodes);
    }
  } else {
    for (let i = 0; i < children.length; i++) {
      if (children[i].children && children[i].children.length) {
        arr.push(...flattenTree(children[i].children, steps - 1, prop, arrIndexAtTargetDepth));
      }
    }
  }
  return arr;
}

export function treeAccessor(sourceDepth, targetDepth, prop, arrIndexAtTargetDepth) {
  if (sourceDepth === targetDepth) {
    return d => d;
  }
  if (sourceDepth > targetDepth) { // traverse upwards
    const steps = Math.max(0, Math.min(100, sourceDepth - targetDepth));
    const path = [...Array(steps)].map(String.prototype.valueOf, 'parent').join('.');
    let fn;
    if (prop) {
      fn = Function('node', `return node.${path}.${prop};`); // eslint-disable-line no-new-func
    } else {
      fn = Function('node', `return node.${path};`); // eslint-disable-line no-new-func
    }
    return fn;
  }
  if (targetDepth > sourceDepth) { // flatten descendants
    const steps = Math.max(0, Math.min(100, targetDepth - sourceDepth));
    const fn = node => flattenTree(node.children, steps - 1, prop, arrIndexAtTargetDepth);
    return fn;
  }
  return false;
}

export function findField(query, { cache }) {
  // if (ATTR_DIM_RX.test(id) && query) { // true if this table is an attribute dimension table
  //   const idx = +/\/(\d+)/.exec(query)[1];
  //   return fields[idx];
  // }

  if (typeof query === 'number') {
    return cache.fields[query];
  }

  const allFields = cache.fields.slice();
  (cache.attributeDimensionFields || []).forEach(fields => allFields.push(...fields));
  (cache.attributeExpressionFields || []).forEach(fields => allFields.push(...fields));
  for (let i = 0; i < allFields.length; i++) {
    // console.log(allFields[i].key());
    if (allFields[i].key() === query || allFields[i].title() === query) {
      return allFields[i];
    }
  }

  throw Error(`Field not found: ${query}`);
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
function normalizeProperties(cfg, dataset, dataProperties, main) {
  const props = {};
  const mainField = main.field || cfg.field ? dataset.field(cfg.field) : null;
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
      }
    }
  });

  return props;
}

// normalize property mapping config
export function getPropsInfo(cfg, dataset) {
  const { main } = normalizeProperties(cfg, dataset, { main: { value: cfg.value } }, {});
  const props = normalizeProperties(cfg, dataset, cfg.props || {}, main);
  return { props, main };
}
