import field from '../../core/data/field';
import resolve from '../../core/data/json-path-resolver';
import { formatter } from '../../core/formatter';

const specialTextValues = {
  '-3': (meta) => {
    if ('othersLabel' in meta) {
      return meta.othersLabel;
    }
    return '';
  }
};

function normalizeValues(path, data, meta) {
  let values = resolve(path, data);
  let normalized = new Array(values.length);
  let cell;
  for (let i = 0; i < values.length; i++) {
    cell = values[i];
    normalized[i] = {
      value: cell.qNum,
      label: cell.qElemNumber in specialTextValues ? specialTextValues[cell.qElemNumber](meta) : cell.qText,
      id: cell.qElemNumber
    };
  }
  return normalized;
}

function collectStraightData(col, page, meta) {
  let values = [];
  let matrixColIdx = col - page.qArea.qLeft;
  if (matrixColIdx >= 0 && matrixColIdx < (page.qArea.qLeft + page.qArea.qWidth) && page.qArea.qHeight > 0) {
    values = normalizeValues(`//${matrixColIdx}`, page.qMatrix, meta);
  }
  return values;
}

// function log(...x) {
//   let xx = x.map(v => JSON.stringify(v, null, 2));
//   console.log(...xx);
// }

function traverseNode(node) {
  let rows = [];
  let children = node.qSubNodes || [];
  let pseudos = [];

  let n = {
    qNum: node.qValue,
    qElemNumber: node.qElemNo,
    qText: node.qText
  };
  if (!children.length) {
    return [[n]];
  }

  if (children[0].qType === 'P') {
    // rows = rows.concat(children[0].qSubNodes.map(traverseNode)[0]);
    for (let i = 0; i < children.length; i++) {
      let pp = children[i].qSubNodes.map(traverseNode).map(v => v[0]);
      pseudos.push(pp);
    }
    let first = pseudos[0];
    pseudos.slice(1).forEach((p) => {
      // log(n.qText, 'pesudorodfsdfws', p);
      first.forEach((row, r) => {
        // log('a', r, p[r]);
        let lastRowValue = p[r].slice(-1)[0];
        row.push(lastRowValue);
      });
    });
    rows = rows.concat(pseudos[0]);
    // log('rows', rows);
  } else {
    for (let i = 0; i < children.length; i++) {
      if (children[i].qType !== 'T') {
        rows = rows.concat(traverseNode(children[i]));
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    rows[i].unshift(n);
  }

  return rows;
}

function transformStackedToStraight(root) {
  let nodes = root ? root.qSubNodes : [];
  let matrix = [];
  for (let i = 0; i < nodes.length; i++) {
    matrix = matrix.concat(traverseNode(nodes[i]));
  }
  return matrix;
}

function collectStackedData(col, page, meta) {
  let matrix = transformStackedToStraight(page.qData[0]);
  return normalizeValues(`//${col}`, matrix, meta);
}

// collect data over multiple pages
// the pages are assumed to be ordered from top to bottom
function collectData(col, pages, meta) {
  let values = [];
  pages.forEach((p) => {
    if (p.qMatrix) {
      values = values.concat(collectStraightData(col, p, meta));
    } else if (p.qData) { // assume stacked data
      values = values.concat(collectStackedData(col, p, meta));
    }
  });
  return values;
}

const minFn = d => d.meta.qMin;
const maxFn = d => d.meta.qMax;
const typeFn = (d) => {
  if ('qStateCounts' in d.meta) {
    return 'dimension';
  }
  return 'measure';
};
const tagsFn = d => d.meta.qTags;
const titleFn = d => d.meta.qFallbackTitle;
const valuesFn = d => collectData(d.idx, d.pages, d.meta);
const formatterFn = (d) => {
  if (d.meta.qNumFormat && d.meta.qNumFormat.qType && ['U', 'I', 'R', 'F', 'M'].indexOf(d.meta.qNumFormat.qType) !== -1) {
    let pattern = d.meta.qNumFormat.qFmt;
    const thousand = d.meta.qNumFormat.qThou || ',';
    const decimal = d.meta.qNumFormat.qDec || '.';
    const type = d.meta.qNumFormat.qType || 'U';

    if (type === 'U') {
      pattern = `#${decimal}##A`;
    }
    return formatter('q')('number')(pattern, thousand, decimal, type);
  } else if (d.meta.qNumFormat && d.meta.qNumFormat.qType && ['D', 'T', 'TS', 'IV'].indexOf(d.meta.qNumFormat.qType) !== -1) {
    return formatter('q')('time')(d.meta.qNumFormat.qFmt, d.meta.qNumFormat.qType);
  }
  return v => v;
};

export default function qField({ id } = {}) {
  return field({
    id,
    formatter: formatterFn,
    min: minFn,
    max: maxFn,
    type: typeFn,
    tags: tagsFn,
    title: titleFn,
    values: valuesFn
  });
}
