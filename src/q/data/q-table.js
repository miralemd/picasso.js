import table from '../../core/data/table';
import qField from './q-field';
import resolve from '../../core/data/json-path-resolver';

const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo(?:\/(\d+))?/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;
const ATTR_EXPR_RX = /\/qAttrExprInfo\/(\d+)/;

function hyperCubeFieldsFn(hc, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) =>
    qField({ id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` })({
      meta: f,
      pages: hc.qDataPages,
      idx,
      localeInfo
    })
  );
}

function attrExpField(hc, fieldIdx, attrIdx, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  const id = fieldIdx < dimz ? `/qDimensionInfo/${fieldIdx}/qAttrExprInfo/${attrIdx}` : `/qMeasureInfo/${fieldIdx - dimz}/qAttrExprInfo/${attrIdx}`;
  const meta = resolve(id, hc);
  let fieldDataContentIdx = fieldIdx;
  if (hc.qMode === 'K' && fieldIdx < dimz) {
    fieldDataContentIdx = hc.qEffectiveInterColumnSortOrder.indexOf(fieldIdx);
  }
  return qField({ id })({
    meta,
    pages: hc.qMode === 'K' ? hc.qStackedDataPages : hc.qDataPages,
    idx: fieldDataContentIdx,
    attrIdx,
    localeInfo
  });
}

function stackedHyperCubeFieldsFn(hc, localeInfo) {
  const dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) => {
    let dataContentIdx = idx;
    const order = hc.qEffectiveInterColumnSortOrder; // sort order should only contain references to dimensions
    if (idx < dimz) { // if dimension, loolup where in the tree the dimension is located
      dataContentIdx = order.indexOf(idx);
    }
    return qField({ id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` })({
      meta: f,
      pages: hc.qStackedDataPages,
      idx: dataContentIdx,
      localeInfo
    });
  });
}

function listObjectFieldsFn(lo) {
  return [qField({ id: '/qDimensionInfo' })({
    meta: lo.qDimensionInfo,
    pages: lo.qDataPages,
    idx: 0
  })];
}

function fieldsFn(data) {
  const hc = data.cube;
  if (Array.isArray(hc.qDimensionInfo)) {
    if (hc.qMode === 'K') {
      return stackedHyperCubeFieldsFn(hc, data.localeInfo);
    }
    return hyperCubeFieldsFn(hc, data.localeInfo);
  }
  return listObjectFieldsFn(hc, data.localeInfo);
}

function getAttrExprField({
  attributeExpressionFields,
  idx,
  path
}, data, localeInfo) {
  const attrIdx = +ATTR_EXPR_RX.exec(path)[1];
  if (!attributeExpressionFields[idx]) {
    attributeExpressionFields[idx] = [];
  }
  if (!attributeExpressionFields[idx][attrIdx]) {
    attributeExpressionFields[idx][attrIdx] = attrExpField(data, idx, attrIdx, localeInfo);
  }
  return attributeExpressionFields[idx][attrIdx];
}

/**
 * Data interface for the Qlik Sense hypercube format
 * @private
 * @param  {function} [fieldFn=qField] Field factory function
 * @return {table}                  Data table
 */
export default function qTable({ id } = {}) {
  const q = table({
    id,
    fields: fieldsFn
  });

  const attributeExpressionFields = [];

  q.findField = (query) => {
    const d = q.data();
    const hc = d.cube;
    const locale = d.localeInfo;
    const fields = q.fields();

    // Find by path
    if (DIM_RX.test(query)) {
      const idx = +DIM_RX.exec(query)[1];
      // check if attribute expr
      const remainder = query.replace(DIM_RX, '');
      if (ATTR_EXPR_RX.test(remainder)) {
        return getAttrExprField({
          attributeExpressionFields,
          idx,
          path: remainder
        }, hc, locale);
      }
      if (Array.isArray(hc.qDimensionInfo)) {
        return fields[idx];
      }
      return fields[0]; // listobject
    } else if (M_RX.test(query)) {
      const idx = +M_RX.exec(query)[1] + hc.qDimensionInfo.length;
      // check if attribute expr
      const remainder = query.replace(M_RX, '');
      if (ATTR_EXPR_RX.test(remainder)) {
        return getAttrExprField({
          attributeExpressionFields,
          idx,
          path: remainder
        }, hc, locale);
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
