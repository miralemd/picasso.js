import { field } from '../field';
import { resolve } from '../json-path-resolver';
import { formatter } from '../../formatter';

export function qField() {
  const q = field()
    .min(d => d.meta.qMin)
    .max(d => d.meta.qMax)
    .tags(d => d.meta.qTags)
    .title(d => d.meta.qFallbackTitle)
    .values(d =>
 resolve(`//${d.idx}`, d.matrix).map(v =>
 ({
   value: v.qNum,
   label: v.qText,
   id: v.qElemNumber
 })
)
)
    .formatter((d) => {
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
    });

  return q;
}
