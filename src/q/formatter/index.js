import { registry } from '../../core/utils/registry';
import numberFormat from './numberFormat';
import timeFormat from './timeFormat';

const reg = registry();

reg.add('number', numberFormat);
reg.add('time', timeFormat);

export default function formatter() {
  function type(t) {
    return reg.has(t) && reg.get(t);
  }

  type.has = function has(t) {
    return reg.has(t);
  };

  return type;
}

export function createFromMetaInfo(meta) {
  if (meta && meta.qNumFormat && ['D', 'T', 'TS', 'IV'].indexOf(meta.qNumFormat.qType) !== -1) {
    return formatter('q')('time')(meta.qNumFormat.qFmt, meta.qNumFormat.qType);
  }
  let pattern = '#';
  let thousand = ',';
  let decimal = '.';
  let type = 'U';
  let isAuto = meta && !!meta.qIsAutoFormat;
  if (meta && meta.qNumFormat) {
    pattern = meta.qNumFormat.qFmt || pattern;
    thousand = meta.qNumFormat.qThou || thousand;
    decimal = meta.qNumFormat.qDec || decimal;
    type = meta.qNumFormat.qType || type;
    isAuto = isAuto && ['M'].indexOf(meta.qNumFormat.qType) === -1;
  }

  if (isAuto) {
    pattern = `#${decimal}##A`;
  }
  return formatter('q')('number')(pattern, thousand, decimal, type);
}
