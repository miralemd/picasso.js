const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo(?:\/(\d+))?/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;
const ATTR_EXPR_RX = /\/qAttrExprInfo\/(\d+)/;
const ATTR_DIM_RX = /\/qAttrDimInfo\/(\d+)/;

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

function getAttrField({
  cache,
  idx,
  path
}) {
  let attrIdx;
  let fieldCache;
  if (ATTR_EXPR_RX.test(path)) {
    fieldCache = cache.attributeExpressionFields;
    attrIdx = +ATTR_EXPR_RX.exec(path)[1];
  } else if (ATTR_DIM_RX.test(path)) {
    fieldCache = cache.attributeDimensionFields;
    attrIdx = +ATTR_DIM_RX.exec(path)[1];
  }

  if (fieldCache && fieldCache[idx] && fieldCache[idx][attrIdx]) {
    return fieldCache[idx][attrIdx];
  }
  throw Error('Attr field not found');
}

export function findField(query, {
  cache,
  cube
}) {
  const hc = cube.qHyperCube ? cube.qHyperCube : cube;
  const locale = {};

  // if (ATTR_DIM_RX.test(id) && query) { // true if this table is an attribute dimension table
  //   const idx = +/\/(\d+)/.exec(query)[1];
  //   return fields[idx];
  // }

  // Find by path
  if (typeof query === 'number') {
    return cache.fields[query];
  } else if (DIM_RX.test(query)) {
    const idx = +DIM_RX.exec(query)[1];
    // check if attribute field
    const remainder = query.replace(DIM_RX, '');
    if (remainder) {
      return getAttrField({
        cache,
        idx,
        path: remainder
      });
    }

    if (Array.isArray(hc.qDimensionInfo)) {
      return (idx < hc.qDimensionInfo.length) ? cache.fields[idx] : null;
    }
    return cache.fields[0]; // listobject
  } else if (M_RX.test(query)) {
    const idx = +M_RX.exec(query)[1] + hc.qDimensionInfo.length;
    // check if attribute field
    const remainder = query.replace(M_RX, '');
    if (remainder) {
      return getAttrField({
        cache,
        idx,
        path: remainder
      }, locale);
    }
    return cache.fields[idx];
  }

  // Find by title
  for (let i = 0; i < cache.fields.length; i++) {
    if (cache.fields[i].title() === query) {
      return cache.fields[i];
    }
  }

  return null;
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
function normalizeProperties(cfg, cube, cache, dataProperties) {
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
        prop.field = findField(pConfig.field, { cube, cache });
        if (!prop.field) {
          throw Error(`Field '${pConfig.field}' not found`);
        }
        prop.source = pConfig.field;
        prop.value = prop.field.value;
      } else {
        prop.source = cfg.field;
        const f = findField(cfg.field, { cube, cache });
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
