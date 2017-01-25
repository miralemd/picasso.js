import scrollApi from '../../../scroll-api';

export function createOrUpdate(options, oldApi) {
  let min = options.min || 0;
  let max = options.max || 0;
  const viewSize = options.viewSize || 0;

  const s = oldApi || scrollApi();
  s.update({ min, max, viewSize });

  return s;
}

export default function builder(obj, composer, oldScrollApis) {
  const scrollApis = {};
  for (const n in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, n)) {
      scrollApis[n] = createOrUpdate(obj[n], oldScrollApis[n]);
    }
  }
  return scrollApis;
}

export function getScrollApi(v, scrollApis) {
  return scrollApis[v];
}
