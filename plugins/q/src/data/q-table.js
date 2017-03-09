import { qField } from '../q';
import resolve from '../json-path-resolver';

const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo(?:\/(\d+))?/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;
const ATTR_EXPR_RX = /\/qAttrExprInfo\/(\d+)/;
const ATTR_DIM_RX = /\/qAttrDimInfo\/(\d+)/;

function hyperCubeFieldsFn(hc, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) => {
    const data = {
      meta: f,
      pages: hc.qDataPages,
      idx,
      localeInfo
    };
    return qField(data, { id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` });
  });
}

function attrExpField(hc, fieldIdx, attrIdx, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  const id = fieldIdx < dimz ? `/qDimensionInfo/${fieldIdx}/qAttrExprInfo/${attrIdx}` : `/qMeasureInfo/${fieldIdx - dimz}/qAttrExprInfo/${attrIdx}`;
  const meta = resolve(id, hc);
  let fieldDataContentIdx = fieldIdx;
  if (hc.qMode === 'K' && fieldIdx < dimz) {
    fieldDataContentIdx = hc.qEffectiveInterColumnSortOrder.indexOf(fieldIdx);
  }
  const data = {
    meta,
    pages: hc.qMode === 'K' ? hc.qStackedDataPages : hc.qDataPages,
    idx: fieldDataContentIdx,
    attrIdx,
    localeInfo
  };
  return qField(data, { id });
}

function attrDimField(hc, fieldIdx, attrDimIdx, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  const id = fieldIdx < dimz ? `/qDimensionInfo/${fieldIdx}/qAttrDimInfo/${attrDimIdx}` : `/qMeasureInfo/${fieldIdx - dimz}/qAttrDimInfo/${attrDimIdx}`;
  const meta = resolve(id, hc);
  let fieldDataContentIdx = fieldIdx;
  if (hc.qMode === 'K' && fieldIdx < dimz) {
    fieldDataContentIdx = hc.qEffectiveInterColumnSortOrder.indexOf(fieldIdx);
  }
  const data = {
    meta,
    pages: hc.qMode === 'K' ? hc.qStackedDataPages : hc.qDataPages,
    idx: fieldDataContentIdx,
    attrDimIdx,
    localeInfo
  };
  return qField(data, { id });
}

function stackedHyperCubeFieldsFn(hc, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) => {
    let dataContentIdx = idx;
    const order = hc.qEffectiveInterColumnSortOrder; // sort order should only contain references to dimensions
    if (idx < dimz) { // if dimension, loolup where in the tree the dimension is located
      dataContentIdx = order.indexOf(idx);
    }
    const data = {
      meta: f,
      pages: hc.qStackedDataPages,
      idx: dataContentIdx,
      localeInfo
    };
    return qField(data, { id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` });
  });
}

function listObjectFieldsFn(lo) {
  const data = {
    meta: lo.qDimensionInfo,
    pages: lo.qDataPages,
    idx: 0
  };
  return [qField(data, { id: '/qDimensionInfo' })];
}

function attrDimFieldsFn(hc, localeInfo) {
  const fields = [];
  const meta = {};
  Object.keys(hc).forEach((key) => {
    if (key === 'qDataPages') {
      return;
    }
    meta[key] = hc[key];
  });
  const data = {
    meta,
    pages: hc.qDataPages,
    idx: 0,
    localeInfo
  };
  fields.push(qField(data, { id: '/0' }));

  const secondFieldData = {
    meta: {
      label: '$unknown'
    },
    pages: hc.qDataPages,
    idx: 1,
    localeInfo
  };
  // TODO - find out the purpose of the second field
  fields.push(qField(secondFieldData, { id: '/1' }));

  return fields;
}

function fieldsFn(data) {
  const hc = data.cube;
  const hasDimInfo = typeof hc.qDimensionInfo !== 'undefined';
  if (Array.isArray(hc.qDimensionInfo)) {
    if (hc.qMode === 'K') {
      return stackedHyperCubeFieldsFn(hc, data.localeInfo);
    }
    return hyperCubeFieldsFn(hc, data.localeInfo);
  } else if (hasDimInfo) {
    return listObjectFieldsFn(hc, data.localeInfo);
  } else if (hc.qSize) {
    return attrDimFieldsFn(hc, data.localeInfo);
  }
  return [];
}

function getAttrField({
  attributeDimensionFieldsCache,
  attributeExpressionFieldsCache,
  idx,
  path
}, hc, localeInfo) {
  let fn;
  let attrIdx;
  let fieldCache;
  if (ATTR_EXPR_RX.test(path)) {
    fieldCache = attributeExpressionFieldsCache;
    fn = attrExpField;
    attrIdx = +ATTR_EXPR_RX.exec(path)[1];
  } else if (ATTR_DIM_RX.test(path)) {
    fieldCache = attributeDimensionFieldsCache;
    fn = attrDimField;
    attrIdx = +ATTR_DIM_RX.exec(path)[1];
  }

  if (!fn) {
    return false;
  }

  if (!fieldCache[idx]) {
    fieldCache[idx] = [];
  }
  if (!fieldCache[idx][attrIdx]) {
    fieldCache[idx][attrIdx] = fn(hc, idx, attrIdx, localeInfo);
  }

  return fieldCache[idx][attrIdx];
}

/**
 * Data interface for the Qlik Sense hypercube format
 * @private
 * @param  {function} [fieldFn=qField] Field factory function
 * @return {table}                  Data table
 */
export default function qTable(tableFn, data, { id } = {}) {
  const q = tableFn(data, {
    id,
    fields: fieldsFn
  });

  const attributeDimensionFieldsCache = [];
  const attributeExpressionFieldsCache = [];

  q.findField = (query) => {
    const d = q.data();
    const hc = d.cube;
    const locale = d.localeInfo;
    const fields = q.fields();

    if (ATTR_DIM_RX.test(id) && query) { // true if this table is an attribute dimension table
      const idx = +/\/(\d+)/.exec(query)[1];
      return fields[idx];
    }

    // Find by path
    if (DIM_RX.test(query)) {
      const idx = +DIM_RX.exec(query)[1];
      // check if attribute field
      const remainder = query.replace(DIM_RX, '');
      const attributeField = getAttrField({
        attributeDimensionFieldsCache,
        attributeExpressionFieldsCache,
        idx,
        path: remainder
      }, hc, locale);

      if (attributeField !== false) {
        return attributeField;
      }

      if (Array.isArray(hc.qDimensionInfo)) {
        return fields[idx];
      }
      return fields[0]; // listobject
    } else if (M_RX.test(query)) {
      const idx = +M_RX.exec(query)[1] + hc.qDimensionInfo.length;
      // check if attribute field
      const remainder = query.replace(M_RX, '');
      const attributeField = getAttrField({
        attributeDimensionFieldsCache,
        attributeExpressionFieldsCache,
        idx,
        path: remainder
      }, hc, locale);

      if (attributeField !== false) {
        return attributeField;
      }

      return fields[idx];
    }

    // Find by title
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].title() === query) {
        return fields[i];
      }
    }

    return undefined;
  };

  return q;
}
