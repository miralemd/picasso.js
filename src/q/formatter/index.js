import { registry } from '../../core/utils/registry';
import numberFormat from './numberFormat';
import timeFormat from './timeFormat';

const reg = registry();

reg.add('number', numberFormat);
reg.add('time', timeFormat);

export default function () {
  function type(t) {
    return reg.has(t) && reg.get(t);
  }

  type.has = function has(t) {
    return reg.has(t);
  };

  return type;
}
