import { qTable } from '../q';
import resolve from '../json-path-resolver';

const ATTR_DIM_RX = /qAttrDimInfo\/\d+$/;

function findCubes(layout) {
  const paths = [];
  function traverse(obj, p) {
    if (Array.isArray(obj)) {
      obj.forEach((o, i) => traverse(o, `${p}/${i}`));
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const type = typeof obj[key];
        if (key === 'qHyperCube' || key === 'qListObject') {
          paths.push(`${p}/${key}`);
          traverse(obj[key], `${p}/${key}`);
        } else if (key === 'qDimensionInfo' || key === 'qMeasureInfo') { // traverse dimensions/measures to find potential attribute dimension tables
          traverse(obj[key], `${p}/${key}`);
        } else if (key === 'qAttrDimInfo') {
          obj[key].forEach((table, tidx) => {
            paths.push(`${p}/${key}/${tidx}`);
          });
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
  return paths.map((p) => {
    const data = {
      cube: resolve(p, layout),
      localeInfo: layout.qLocaleInfo
    };
    return qTable(data, { id: p });
  });
}

function findField(path, tables) {
  const matches = tables.filter(t => path.indexOf(t.id()) === 0);
  matches.sort((a, b) => path.replace(a.id(), '').length - path.replace(b.id(), '').length);
  const table = matches[0];
  let field;
  if (table) {
    const subpath = path.replace(table.id(), '');
    field = table.findField(subpath);
  }
  return {
    table,
    field
  };
}

export default function qDataset(datasetFn, data) {
  const qds = datasetFn(data, {
    tables: tablesFn
  });

  qds.findField = (q) => {
    let hay = qds.tables();
    if (ATTR_DIM_RX.test(q)) { // if q ~= '/qAttrDimInfo/0'
      // remove attr dim tables
      hay = hay.filter(t => !ATTR_DIM_RX.test(t.id()));
    }
    return findField(q, hay);
  };

  return qds;
}
