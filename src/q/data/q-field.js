import field from '../../core/data/field';
import resolve from '../../core/data/json-path-resolver';
import { createFromMetaInfo } from '../formatter';

const specialTextValues = {
  '-3': (meta) => {
    if ('othersLabel' in meta) {
      return meta.othersLabel;
    }
    return '';
  }
};

function normalizeValues(path, data, meta, attrIdx, attrDimIdx, offset = 0) {
  let values = resolve(path, data);
  let normalized = new Array(values.length);
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
    qAttrExps: node.qAttrExps
  };
  if (!children.length) {
    return [[n]];
  }

  if (children[0].qType === 'P') {
    // rows = rows.concat(children[0].qSubNodes.map(traverseNode)[0]);
    for (let i = 0; i < children.length; i++) {
      const pp = children[i].qSubNodes.map(traverseNode).map(v => v[0]);
      pseudos.push(pp);
    }
    const first = pseudos[0];
    pseudos.slice(1).forEach((p) => {
      // log(n.qText, 'pesudorodfsdfws', p);
      first.forEach((row, r) => {
        // log('a', r, p[r]);
        const lastRowValue = p[r].slice(-1)[0];
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
  const nodes = root ? root.qSubNodes : [];
  let matrix = [];
  for (let i = 0; i < nodes.length; i++) {
    matrix = matrix.concat(traverseNode(nodes[i]));
  }
  return matrix;
}

function collectStackedData(col, page, meta, attrIdx) {
  const matrix = transformStackedToStraight(page.qData[0]);
  return normalizeValues(`//${col}`, matrix, meta, attrIdx);
}

// collect data over multiple pages
// the pages are assumed to be ordered from top to bottom
function collectData({ colIdx, pages, fieldMeta, attrIdx, attrDimIdx }) {
  let values = [];
  pages.forEach((p) => {
    if (p.qMatrix) {
      values = values.concat(collectStraightData(colIdx, p, fieldMeta, attrIdx, attrDimIdx));
    } else if (p.qData) { // assume stacked data
      values = values.concat(collectStackedData(colIdx, p, fieldMeta, attrIdx));
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
const valuesFn = d => collectData({
  colIdx: d.idx,
  attrIdx: d.attrIdx,
  attrDimIdx: d.attrDimIdx,
  pages: d.pages,
  fieldMeta: d.meta
});
const formatterFn = d => createFromMetaInfo(d.meta, d.localeInfo);

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
