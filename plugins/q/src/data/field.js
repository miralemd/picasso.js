import picker from '../json-path-resolver';
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

// const tagsFn = d => d.qTags;
const elemNoFn = cube => (cube.qMode === 'S' ? (d => d.qElemNumber) : (d => d.qElemNo));

function extractStraight(fieldIdx, meta, cube, page, attrIdx, attrDimIdx) {
  const items = [];
  const matrixColIdx = fieldIdx - page.qArea.qLeft;
  if (matrixColIdx >= 0 && matrixColIdx < (page.qArea.qLeft + page.qArea.qWidth) && page.qArea.qHeight > 0) {
    let s = `/qMatrix/*/${matrixColIdx}`;
    if (typeof attrIdx === 'number') {
      s += `/*/qAttrExps/qValues/${attrIdx}`;
    }
    if (typeof attrDimIdx === 'number') {
      s += `/*/qAttrDims/qValues/${attrDimIdx}`;
    }
    const original = picker(s, page);
    for (let i = 0; i < original.length; i++) {
      const obj = { ...original[i], qRow: i + page.qArea.qTop };
      if (obj.qElemNumber in specialTextValues) {
        obj.qText = specialTextValues[obj.qElemNumber](meta);
      }
      items.push(obj);
    }
  }

  return items;
}

export function getKPath(fieldIdx, cube) {
  let idx = fieldIdx;
  const numDimz = cube.qDimensionInfo.length;
  const numMeas = cube.qMeasureInfo.length;
  const order = cube.qEffectiveInterColumnSortOrder;
  if (idx < numDimz && order) {
    idx = order.indexOf(idx);
  } else if (idx >= numDimz && order && numMeas > 1 && order.indexOf(-1) !== -1) {
    idx = order.indexOf(-1);
  }
  let s = '/qData/*/qSubNodes';
  const depth = Math.max(0, Math.min(idx, numDimz));
  let i = 0;
  for (; i < depth; i++) { // traverse down to specified depth
    // if (order && order[i] === -1) {
      // s += '/0/qSubNodes';
    // } else {
    s += '/*/qSubNodes';
    // }
  }
  if (fieldIdx >= numDimz) {
    // if the depth is a pseudo level, pick the given pseudo dimension, and then traverse down to leaf level (value nodes)
    if (numMeas > 1) {
      s += `/${fieldIdx - numDimz}`; // pick pseudo dimension (measure)
      // traverse to value nodes
      for (; i <= numDimz; i++) {
        s += '/qSubNodes/*';
      }
    } else {
      s += `/${fieldIdx - numDimz}`;
    }
  }
  return s;
}

function getAttrPath(s, attrIdx, attrDimIdx) {
  if (typeof attrIdx === 'number') {
    return `${s}/*/qAttrExps/qValues/${attrIdx}`;
  }
  if (typeof attrDimIdx === 'number') {
    return `${s}/*/qAttrDims/qValues/${attrDimIdx}`;
  }
  return s;
}

function extractStacked(fieldIdx, meta, cube, page, attrIdx, attrDimIdx) {
  const s = getAttrPath(getKPath(fieldIdx, cube), attrIdx, attrDimIdx);
  const original = picker(s, page).filter(c => c.qElemNo !== -1);
  return original;
}

function extractFieldItems(fieldIdx, meta, cube, page, attrIdx, attrDimIdx) {
  let items = [];
  if (cube.qMode === 'S') {
    items = extractStraight(fieldIdx, meta, cube, page, attrIdx, attrDimIdx);
  } else if (cube.qMode === 'K') {
    items = extractStacked(fieldIdx, meta, cube, page, attrIdx, attrDimIdx);
  }

  return items;
}

export default function qField({
  meta,
  pages,
  cube,
  localeInfo,
  idx,
  attrIdx,
  attrDimIdx
 } = {}) {
  let values;

  const type = ('qStateCounts' in meta || 'qSize' in meta) ? 'dimension' : 'measure';
  const valueFn = type === 'dimension' ? elemNoFn(cube) : (d => d.qValue);
  const labelFn = d => d.qText;
  const formatter = createFromMetaInfo(meta, localeInfo);

  const f = {
    title: () => meta.qFallbackTitle || meta.label,
    type: () => type,
    items: () => {
      if (!values) {
        values = [];
        pages.forEach((page) => {
          let vv = extractFieldItems(idx, meta, cube, page, attrIdx, attrDimIdx);
          if (vv && vv.length) {
            values.push(...vv);
          }
        });
      }
      return values;
    },
    min: () => meta.qMin,
    max: () => meta.qMax,
    value: valueFn,
    label: labelFn,
    formatter,
    tags: () => meta.qTags
  };

  return f;
}
