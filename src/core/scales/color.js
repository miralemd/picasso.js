import extend from 'extend';
import { interpolateViridis } from 'd3-scale';
import linear from './linear';

function getMinMax(fields) {
  return {
    min: Math.min(...fields.map(m => m.min())),
    max: Math.max(...fields.map(m => m.max()))
  };
}

export default function color(settings, fields) {
  const s = linear(settings, fields);
  let { min, max } = getMinMax(fields);
  const fn = function fn(v) {
    return interpolateViridis(fn.get(v.value));
  };
  extend(true, fn, s);

  fn.range(settings.invert ? [1, 0] : [0, 1]);
  fn.domain([min, max]);
  // fn.scale = s;

  return fn;
}
