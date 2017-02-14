import table from '../../core/data/table';
import qField from './q-field';

const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo(?:\/(\d+))?/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;

function hyperCubeFieldsFn(hc) {
  let dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) =>
    qField({ id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` })({
      meta: f,
      pages: hc.qDataPages,
      idx
    })
  );
}

function stackedHyperCubeFieldsFn(hc) {
  let dimz = hc.qDimensionInfo.length;
  return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) => {
    let dataContentIdx = idx;
    const order = hc.qEffectiveInterColumnSortOrder; // sort order should only contain references to dimensions
    if (idx < dimz) { // if dimension, loolup where in the tree the dimension is located
      dataContentIdx = order.indexOf(idx);
    }
    return qField({ id: idx < dimz ? `/qDimensionInfo/${idx}` : `/qMeasureInfo/${idx - dimz}` })({
      meta: f,
      pages: hc.qStackedDataPages,
      idx: dataContentIdx
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

function fieldsFn(hc) {
  if (Array.isArray(hc.qDimensionInfo)) {
    if (hc.qMode === 'K') {
      return stackedHyperCubeFieldsFn(hc);
    }
    return hyperCubeFieldsFn(hc);
  }
  return listObjectFieldsFn(hc);
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

  q.findField = (query) => {
    const d = q.data();
    const fields = q.fields();

    // Find by path
    if (DIM_RX.test(query)) {
      const idx = +DIM_RX.exec(query)[1];
      if (Array.isArray(d.qDimensionInfo)) { // listobject
        return fields[idx];
      }
      return fields[0];
    } else if (M_RX.test(query)) {
      const idx = +M_RX.exec(query)[1] + d.qDimensionInfo.length;
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
