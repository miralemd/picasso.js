import resolve from '../json-path-resolver';
import { createFromMetaInfo } from '../formatter';

/* eslint prefer-spread:0 */

const specialTextValues = {
  '-3': (meta) => {
    if ('othersLabel' in meta) {
      return meta.othersLabel;
    }
    return '';
  }
};

function normalizeValues(path, data, meta, attrIdx, attrDimIdx, offset = 0) {
  const values = resolve(path, data);
  const normalized = new Array(values.length);
  let cell;
  let elemNo;
  for (let i = 0; i < values.length; i++) {
    cell = values[i];
    elemNo = cell.qElemNumber || 0;
    if (typeof attrIdx !== 'undefined') {
      cell = values[i].qAttrExps.qValues[attrIdx];
      elemNo = cell.qElemNo || 0;
    } else if (typeof attrDimIdx !== 'undefined') {
      cell = values[i].qAttrDims.qValues[attrDimIdx];
      elemNo = cell.qElemNo || 0;
    }
    normalized[i] = {
      value: cell.qNum,
      index: typeof cell.qRow !== 'undefined' ? cell.qRow : offset + i,
      label: elemNo in specialTextValues ? specialTextValues[elemNo](meta) : cell.qText,
      id: elemNo
    };
  }
  return normalized;
}

function collectStraightData(col, page, meta, attrIdx, attrDimIdx) {
  let values = [];
  const matrixColIdx = col - page.qArea.qLeft;
  if (matrixColIdx >= 0 && matrixColIdx < (page.qArea.qLeft + page.qArea.qWidth) && page.qArea.qHeight > 0) {
    values = normalizeValues(`//${matrixColIdx}`, page.qMatrix, meta, attrIdx, attrDimIdx, page.qArea.qTop);
  }
  return values;
}

// function log(...x) {
//   let xx = x.map(v => JSON.stringify(v, null, 2));
//   console.log(...xx);
// }

function traverseNode(node) {
  let rows = [];
  const children = node.qSubNodes || [];
  const pseudos = [];

  const n = {
    qNum: node.qValue,
    qElemNumber: node.qElemNo,
    qText: node.qText,
    qRow: node.qRow,
    qAttrExps: node.qAttrExps,
    qAttrDims: node.qAttrDims
  };
  if (!children.length) {
    return [[n]];
  }

  if (children[0].qType === 'P') {
    for (let i = 0, len = children.length; i < len; i++) {
      const subNodes = children[i].qSubNodes;
      let traversed;
      const pp = [];
      for (let j = 0, subs = subNodes.length; j < subs; j++) {
        traversed = traverseNode(subNodes[j]);
        pp.push.apply(pp, traversed);
      }
      pseudos.push(pp);
    }
    const first = pseudos[0];
    let last;
    for (let p = 1; p < pseudos.length; p++) {
      for (let c = 0; c < first.length; c++) {
        last = pseudos[p][c].slice(-1)[0];
        first[c].push(last);
      }
    }
    rows.push.apply(rows, pseudos[0]);
  } else {
    for (let i = 0; i < children.length; i++) {
      if (children[i].qType !== 'T') {
        rows.push.apply(rows, traverseNode(children[i]));
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    rows[i].unshift(n);
  }

  return rows;
}

export function transformStackedToStraight(root) {
  const nodes = root ? root.qSubNodes : [];
  let matrix = [];
  for (let i = 0; i < nodes.length; i++) {
    matrix.push.apply(matrix, traverseNode(nodes[i]));
  }
  return matrix;
}

function collectStackedData(col, page, meta, attrIdx, attrDimIdx) {
  const matrix = transformStackedToStraight(page.qData[0]);
  return normalizeValues(`//${col}`, matrix, meta, attrIdx, attrDimIdx);
}

// collect data over multiple pages
// the pages are assumed to be ordered from top to bottom
function collectData({ colIdx, pages, fieldMeta, attrIdx, attrDimIdx }) {
  let values = [];
  pages.forEach((p) => {
    if (p.qMatrix) {
      values.push.apply(values, collectStraightData(colIdx, p, fieldMeta, attrIdx, attrDimIdx));
    } else if (p.qData) { // assume stacked data
      values.push.apply(values, collectStackedData(colIdx, p, fieldMeta, attrIdx, attrDimIdx));
    }
  });
  return values;
}

const minFn = d => d.meta.qMin;
const maxFn = d => d.meta.qMax;
const typeFn = (d) => {
  if ('qStateCounts' in d.meta || 'qSize' in d.meta) {
    return 'dimension';
  }
  return 'measure';
};
const tagsFn = d => d.meta.qTags;
const titleFn = d => d.meta.label || d.meta.qFallbackTitle;
const valuesFn = d => collectData({
  colIdx: d.idx,
  attrIdx: d.attrIdx,
  attrDimIdx: d.attrDimIdx,
  pages: d.pages,
  fieldMeta: d.meta
});
const formatterFn = d => createFromMetaInfo(d.meta, d.localeInfo);

export default function qField(fieldFn, data, { id } = {}) {
  let valuesCache;
  return fieldFn(data, {
    id,
    formatter: formatterFn,
    min: minFn,
    max: maxFn,
    type: typeFn,
    tags: tagsFn,
    title: titleFn,
    values: (d) => {
      if (!valuesCache) {
        valuesCache = valuesFn(d);
      }
      return valuesCache;
    }
  });
}
