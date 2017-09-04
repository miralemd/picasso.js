import {
  hierarchy
} from 'd3-hierarchy';

import {
  findField,
  getPropsInfo
} from './util';

import picker from '../json-path-resolver';

export function getKPath(fieldIdx, cube) {
  let idx = fieldIdx;
  const numDimz = cube.qDimensionInfo.length;
  const numMeas = cube.qMeasureInfo.length;
  const order = cube.qEffectiveInterColumnSortOrder;
  if (idx < numDimz && order) {
    idx = order.indexOf(idx);
  } else if (idx >= numDimz && order && numMeas > 1 && order.indexOf(-1) !== -1) {
    idx = order.indexOf(-1);
  }
  let s = '/qData/*/qSubNodes';
  const depth = Math.max(0, Math.min(idx, numDimz));
  let i = 0;
  for (; i < depth; i++) { // traverse down to specified depth
    s += '/*/qSubNodes';
  }
  if (fieldIdx >= numDimz) {
    // if the depth is a pseudo level, pick the given pseudo dimension, and then traverse down to leaf level (value nodes)
    if (numMeas > 1) {
      s += `/${fieldIdx - numDimz}/qSubNodes`; // pick pseudo dimension (measure)
      ++i;
      // traverse to value nodes
      for (; i <= numDimz; i++) {
        s += '/*/qSubNodes';
      }
    } else {
      s += `/${fieldIdx - numDimz}`;
    }
  }
  return s;
}

function getAttrPath(s, attrIdx, attrDimIdx) {
  if (typeof attrIdx === 'number') {
    return `${s}/*/qAttrExps/qValues/${attrIdx}`;
  }
  if (typeof attrDimIdx === 'number') {
    return `${s}/*/qAttrDims/qValues/${attrDimIdx}`;
  }
  return s;
}


export function getPathToFieldItems(field, {
  cache,
  cube
}) {
  if (!field) {
    return '';
  }
  let fieldIdx = cache.fields.indexOf(field);
  let attrIdx;
  let attrDimIdx;
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
  return getAttrPath(getKPath(fieldIdx, cube), attrIdx >= 0 ? attrIdx : undefined, attrDimIdx >= 0 ? attrDimIdx : undefined);
}

function getTreePath(field, { cache, cube }) {
  const s1 = getPathToFieldItems(field, { cache, cube });
  const s2 = s1.replace(/qSubNodes/g, 'children');
  const s3 = s2.replace(/children$/g, 'children/*');
  return s3.replace(/qData\/\*/, '');
}

export function transformH(config, cube, cache) {
  const rootPath = '/qStackedDataPages/*/qData';

  const root = picker(rootPath, cube);
  if (!root || !root[0]) {
    return null;
  }

  const h = hierarchy(root[0], config.children || (node => node.qSubNodes));

  const height = h.height;
  const propDefs = [];
  for (let i = 0; i <= height; i++) {
    const { props, main } = getPropsInfo(config, cube, cache);
    const propsArr = Object.keys(props);
    propDefs[i] = { propsArr, props, main };
    let currentField = null;
    const isRoot = i === 0;
    if (i > 0) {
      let idx = cube.qEffectiveInterColumnSortOrder[i - 1];
      // if (idx === -1) { // pseudo
      //   let childIdx = node.parent.children.indexOf(node);
      //   idx = cube.qDimensionInfo.length + childIdx; // measure field
      // }
      if (i > cube.qEffectiveInterColumnSortOrder.length) {
        idx = cube.qDimensionInfo.length;
      }

      currentField = cache.fields[idx];
    }
    const currentItemsPath = currentField ? getTreePath(currentField, { cube, cache }) : rootPath;

    propsArr.forEach((prop) => {
      const p = props[prop];

      if (p.field) {
        const fieldPath = getTreePath(p.field, { cube, cache });
        if (fieldPath === currentItemsPath) {
          p.isSame = true;
        } else if (isRoot) {
          p.isDescendant = true;
          p.path = `${fieldPath}/data`;
        } else {
          const isDescendant = fieldPath.match(/\//g).length > currentItemsPath.match(/\//g).length;
          let pathToNode = '';
          if (isDescendant) {
            pathToNode = `${fieldPath.replace(currentItemsPath, '').replace(/^\/\*/, '')}/data`;
          } else {
            pathToNode = Math.ceil((currentItemsPath.match(/\//g).length - fieldPath.match(/\//g).length) / 2);
          }
          p.isDescendant = isDescendant;
          p.path = pathToNode;
        }
      }
    });
  }

  const originalData = [];
  let expando = 0;
  h.each((node) => {
    const currentOriginal = originalData[expando++] = node.data;
    const propsArr = propDefs[node.depth].propsArr;
    const props = propDefs[node.depth].props;
    const main = propDefs[node.depth].main;

    node.data = {
      value: typeof main.value === 'function' ? main.value(currentOriginal) : currentOriginal
    };
    propsArr.forEach((prop) => {
      const p = props[prop];
      let fn = v => v;
      let value;
      if (p.type === 'primitive') {
        value = p.value;
      } else {
        if (typeof p.value === 'function') {
          fn = v => p.value(v);
        }
        if (!p.field) {
          value = currentOriginal;
        } else if (p.isSame) {
          value = currentOriginal;
        } else if (p.isDescendant) {
          value = picker(p.path, node);
          if (Array.isArray(value)) {
            value = value.map(fn);
            fn = p.reduce || (v => v.join(', '));
          }
        } else if (p.path) { // ancestor
          const num = p.path || 0;
          let it = node;
          for (let i = 0; i < num; i++) {
            it = it.parent;
          }
          value = it.data.value;
        }
      }
      node.data[prop] = {
        value: fn(value)
      };
      if (p.source) {
        node.data[prop].source = { field: p.source };
      }
    });
  });

  return h;
}

export function transformStacked(config, cube, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (cfg.field) {
      const f = findField(cfg.field, { cube, cache });
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
      const itemsPath = getTreePath(f, { cube, cache });
      const items = picker(itemsPath, cache.tree);
      propsArr.forEach((prop) => {
        const p = props[prop];
        if (p.field) {
          const fieldPath = getTreePath(p.field, { cube, cache });
          if (fieldPath === itemsPath) {
            p.isSame = true;
          } else {
            const isDescendant = fieldPath.match(/\//g).length > itemsPath.match(/\//g).length;
            let pathToNode = '';
            if (isDescendant) {
              pathToNode = `${fieldPath.replace(itemsPath, '').replace(/^\/\*/, '')}/*/data`;
            } else {
              pathToNode = Math.ceil((itemsPath.match(/\//g).length - fieldPath.match(/\//g).length) / 2);
            }
            p.isDescendant = isDescendant;
            p.path = pathToNode;
          }
        }
      });
      const mapped = items.map((item) => {
        const ret = {
          value: typeof main.value === 'function' ? main.value(item.data) : (typeof main.value !== 'undefined' ? main.value : item.data), // eslint-disable-line no-nested-ternary
          source: {
            field: cfg.field
          }
        };
        propsArr.forEach((prop) => {
          const p = props[prop];
          let fn = v => v;
          let value;
          if (p.type === 'primitive') {
            value = p.value;
          } else {
            if (typeof p.value === 'function') {
              fn = v => p.value(v);
            }
            if (!p.field) {
              value = item.data;
            } else if (p.isSame) {
              value = item.data;
            } else if (p.isDescendant) {
              value = picker(p.path, item);
              if (Array.isArray(value)) {
                value = value.map(fn);
                fn = (v => v.join(', '));
              }
            } else if (p.path) { // ancestor
              const num = p.path || 0;
              let it = item;
              for (let i = 0; i < num; i++) {
                it = it.parent;
              }
              value = it.data;
            }
          }
          ret[prop] = {
            value: fn(value)
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
