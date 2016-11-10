import { table } from '../table';
import { qField } from './q-field';

const DIM_RX = /^\/(?:qHyperCube\/)?qDimensionInfo\/(\d+)/;
const M_RX = /^\/(?:qHyperCube\/)?qMeasureInfo\/(\d+)/;

const fieldFactoryFn = function (fieldFn) {
  return function (hc) {
    return hc.qDimensionInfo.concat(hc.qMeasureInfo).map((f, idx) =>
       fieldFn().data({
         meta: f,
         matrix: hc.qDataPages[0].qMatrix,
         idx
       })
    );
  };
};

/**
 * Data interface for the Qlik Sense hypercube format
 * @private
 * @param  {function} [fieldFn=qField] Field factory function
 * @return {table}                  Data table
 */
export function qTable(fieldFn = qField) {
  const q = table()
    .rows(d => d.qSize.qcy)
    .cols(d => d.qSize.qcx)
    .fields(fieldFactoryFn(fieldFn));

  q.findField = function (query) {
    const d = q.data();
    const numDimz = d.qDimensionInfo.length;
    const fields = q.fields();

        // Find by path
    if (DIM_RX.test(query)) {
      const idx = +DIM_RX.exec(query)[1];
      return fields[idx];
    } else if (M_RX.test(query)) {
      const idx = +M_RX.exec(query)[1] + numDimz;
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
