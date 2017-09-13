import {
  hierarchy
} from 'd3-hierarchy';

import picker from '../json-path-resolver';

import {
  getPropsInfo,
  treeAccessor
} from './util';

const DIM_RX = /^qDimensionInfo(?:\/(\d+))?/;
const M_RX = /^qMeasureInfo\/(\d+)/;
const ATTR_EXPR_RX = /\/qAttrExprInfo\/(\d+)/;
const ATTR_DIM_RX = /\/qAttrDimInfo\/(\d+)/;

function getFieldDepth(field, { cube }) {
  if (!field) {
    return -1;
  }
  let key = field.key();
  let isFieldDimension = false;
  let fieldIdx = -1; // cache.fields.indexOf(field);
  let attrIdx = -1;
  let attrDimIdx = -1;
  let fieldDepth = -1;
  let pseudoMeasureIndex = -1;
  let remainder;

  if (DIM_RX.test(key)) {
    isFieldDimension = true;
    fieldIdx = +DIM_RX.exec(key)[1];
    remainder = key.replace(DIM_RX, '');
  } else if (M_RX.test(key)) {
    pseudoMeasureIndex = +M_RX.exec(key)[1];
    remainder = key.replace(M_RX, '');
  }

  if (remainder) {
    if (ATTR_DIM_RX.exec(remainder)) {
      attrDimIdx = +ATTR_DIM_RX.exec(remainder)[1];
    } else if (ATTR_EXPR_RX.exec(remainder)) {
      attrIdx = +ATTR_EXPR_RX.exec(remainder)[1];
    }
  }

  const treeOrder = cube.qEffectiveInterColumnSortOrder;

  if (isFieldDimension) {
    fieldDepth = treeOrder ? treeOrder.indexOf(fieldIdx) : fieldIdx;
  } else if (treeOrder && treeOrder.indexOf(-1) !== -1) { // if pseudo dimension exists in sort order
    fieldDepth = treeOrder.indexOf(-1); // depth of pesudodimension
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

export default function extract(config, dataset, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (cfg.field) {
      const cube = dataset.raw();
      const f = typeof cfg.field === 'object' ? cfg.field : dataset.field(cfg.field);
      const { props, main } = getPropsInfo(cfg, dataset);
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
            field: main.field.key()
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
          if (p.field) {
            ret[prop].source = { field: p.field.key() };
          }
        });
        return ret;
      });
      dataItems.push(...mapped);
    }
  });
  return dataItems;
}
