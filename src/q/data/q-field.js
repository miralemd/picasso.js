import field from '../../core/data/field';
import resolve from '../../core/data/json-path-resolver';
import { formatter } from '../../core/formatter';

// collect data over multiple pages
// the pages are assumed bo be ordered from top to bottom
function collectData(col, pages) {
  let values = [];
  pages.forEach((p) => {
    let matrixColIdx = col - p.qArea.qLeft;
    if (matrixColIdx >= 0 && matrixColIdx < (p.qArea.qLeft + p.qArea.qWidth) && p.qArea.qHeight > 0) {
      values = values.concat(resolve(`//${matrixColIdx}`, p.qMatrix).map(v =>
        ({
          value: v.qNum,
          label: v.qText,
          id: v.qElemNumber
        })));
    }
  });
  return values;
}

const minFn = d => d.meta.qMin;
const maxFn = d => d.meta.qMax;
const typeFn = d => 'qStateCounts' in d.meta ? 'dimension' : 'measure';
const tagsFn = d => d.meta.qTags;
const titleFn = d => d.meta.qFallbackTitle;
const valuesFn = d => collectData(d.idx, d.pages);
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
