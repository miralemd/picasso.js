import qTableFn from './data/q-table';
import qFieldFn from './data/q-field';
import qDatasetFn from './data/q-dataset';

let p;

export default function init(picasso) {
  p = picasso;
}

export function qTable(data, { id } = {}) {
  return qTableFn(p.table, data, { id });
}

export function qField(data, { id } = {}) {
  return qFieldFn(p.field, data, { id });
}

export function qDataset(data) {
  return qDatasetFn(p.dataset, data);
}
