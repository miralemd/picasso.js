import dataset from '../../core/data/dataset';
import qTable from './q-table';
import resolve from '../../core/data/json-path-resolver';

function findCubes(layout) {
  // TODO - add dimension attribute tables
  let paths = [];
  function traverse(obj, p) {
    if (Array.isArray(obj)) {
      obj.forEach((o, i) => traverse(o, `${p}/${i}`));
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const type = typeof obj[key];
        if (key === 'qHyperCube' || key === 'qListObject') {
          paths.push(`${p}/${key}`);
        } else if (type === 'object' && /^[^q]/.test(key)) { // look only inside non-primitives, and those whose name does not begin with 'q'
          traverse(obj[key], `${p}/${key}`);
        }
      });
    }
  }

  traverse(layout, '');
  return paths;
}

function tablesFn(layout) {
  const paths = findCubes(layout);
  return paths.map(p => qTable({ id: p })(resolve(p, layout)));
}

export default function qDataset() {
  const qds = dataset({
    tables: tablesFn
  });

  return qds;
}
