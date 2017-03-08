import scrollApi from '../../scroll-api';

export function createOrUpdate(options, oldApi) {
  const min = options.min || 0;
  const max = options.max || 0;
  const viewSize = options.viewSize || 0;

  const s = oldApi || scrollApi();
  s.update({ min, max, viewSize });

  return s;
}

export default function builder(obj, chart, oldScrollApis, isPartial) {
  const scrollApis = {};
  for (const n in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, n)) {
      scrollApis[n] = createOrUpdate(obj[n], oldScrollApis ? oldScrollApis[n] : null, isPartial);
    }
  }
  return scrollApis;
}

export function getScrollApi(v, scrollApis) {
  return scrollApis[v];
}
