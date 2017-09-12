import {
  hierarchy
} from 'd3-hierarchy';

import picker from '../json-path-resolver';

import {
  findField,
  getPropsInfo,
  treeAccessor
} from './util';

function getFieldDepth(field, { cube, cache }) {
  if (!field) {
    return -1;
  }
  let fieldIdx = cache.fields.indexOf(field);
  let attrIdx = -1;
  let attrDimIdx = -1;
  let fieldDepth = -1;
  let pseudoMeasureIndex = -1;
  if (fieldIdx === -1) {
    for (let i = 0; i < cache.attributeDimensionFields.length; i++) {
      attrDimIdx = cache.attributeDimensionFields[i] ? cache.attributeDimensionFields[i].indexOf(field) : -1;
      if (attrDimIdx !== -1) {
        fieldIdx = i;
        break;
      }
    }
  }
  if (fieldIdx === -1) {
    for (let i = 0; i < cache.attributeExpressionFields.length; i++) {
      attrIdx = cache.attributeExpressionFields[i] ? cache.attributeExpressionFields[i].indexOf(field) : -1;
      if (attrIdx !== -1) {
        fieldIdx = i;
        break;
      }
    }
  }

  const isFieldDimension = fieldIdx < cube.qDimensionInfo.length;
  const treeOrder = cube.qEffectiveInterColumnSortOrder;

  if (isFieldDimension) {
    fieldDepth = treeOrder ? treeOrder.indexOf(fieldIdx) : fieldIdx;
  } else if (treeOrder && treeOrder.indexOf(-1) !== -1) { // if pseudo dimension exists in sort order
    fieldDepth = treeOrder.indexOf(-1); // depth of pesudodimension
    pseudoMeasureIndex = fieldIdx - cube.qDimensionInfo.length; // the index of the measure in the pseudo dimension level
  } else { // assume measure is at the bottom of the tree
    fieldDepth = cube.qDimensionInfo.length;
  }

  return {
    fieldDepth: fieldDepth + 1, // +1 due to root node
    pseudoMeasureIndex,
    attrDimIdx,
    attrIdx
  };
}

function getFieldAccessor(sourceDepthObject, targetDepthObject, prop) {
  let nodeFn = treeAccessor(sourceDepthObject.fieldDepth, targetDepthObject.fieldDepth, prop, targetDepthObject.pseudoMeasureIndex);
  let attrFn;

  if (targetDepthObject.attrDimIdx >= 0) {
    attrFn = data => data.qAttrDims.qValues[targetDepthObject.attrDimIdx];
  } else if (targetDepthObject.attrIdx >= 0) {
    attrFn = data => data.qAttrExps.qValues[targetDepthObject.attrIdx];
  }

  return {
    nodeFn,
    attrFn
  };
}

export default function extract(config, cube, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (cfg.field) {
      const f = typeof cfg.field === 'object' ? cfg.fieldf : findField(cfg.field, { cube, cache });
      if (!f) {
        throw Error(`Field '${cfg.field}' not found`);
      }
      const { props, main } = getPropsInfo(cfg, cube, cache);
      const propsArr = Object.keys(props);
      const rootPath = '/qStackedDataPages/*/qData';
      if (!cache.tree) {
        const root = picker(rootPath, cube);
        cache.tree = hierarchy(root[0], node => node.qSubNodes);
      }
      const itemDepthObject = getFieldDepth(f, { cube, cache });
      const { nodeFn, attrFn } = getFieldAccessor({ fieldDepth: 0 }, itemDepthObject);

      const items = nodeFn(cache.tree);
      propsArr.forEach((prop) => {
        const p = props[prop];
        if (p.field) {
          if (p.field === f) {
            p.isSame = true;
          } else {
            const depthObject = getFieldDepth(p.field, { cube, cache });
            const accessors = getFieldAccessor(itemDepthObject, depthObject, 'data');
            p.accessor = accessors.nodeFn;
            p.attrAccessor = accessors.attrFn;
          }
        }
      });
      const mapped = items.map((item) => {
        const itemData = attrFn ? attrFn(item.data) : item.data;
        const ret = {
          value: typeof main.value === 'function' ? main.value(itemData) : (typeof main.value !== 'undefined' ? main.value : itemData), // eslint-disable-line no-nested-ternary
          source: {
            field: cfg.field
          }
        };
        propsArr.forEach((prop) => {
          const p = props[prop];
          let fn;
          let value;
          if (p.type === 'primitive') {
            value = p.value;
          } else {
            if (typeof p.value === 'function') { // accessor function
              fn = p.value;
            }
            if (p.accessor) {
              value = p.accessor(item);
              if (Array.isArray(value)) {
                if (p.attrAccessor) {
                  value = value.map(p.attrAccessor);
                }
                if (fn) {
                  value = value.map(fn);
                  fn = null;
                }
                value = value.join(', '); // TODO - enable reducers
              } else {
                value = p.attrAccessor ? p.attrAccessor(value) : value;
              }
            } else {
              value = itemData;
            }
          }
          ret[prop] = {
            value: fn ? fn(value) : value
          };
          if (p.source) {
            ret[prop].source = { field: p.source };
          }
        });
        return ret;
      });
      dataItems.push(...mapped);
    }
  });
  return dataItems;
}
