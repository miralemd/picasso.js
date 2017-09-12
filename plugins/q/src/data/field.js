import { createFromMetaInfo } from '../formatter';

// const tagsFn = d => d.qTags;
const elemNoFn = cube => (cube.qMode === 'S' ? (d => d.qElemNumber) : (d => d.qElemNo));

export default function qField({
  meta,
  cube,
  localeInfo,
  fieldExtractor
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
        values = fieldExtractor(f);
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
