import { band } from '../../../scales/band';

function unique(values) {
  const exists = {};
  return values.filter(v =>
   exists[v.id] ? false : (exists[v.id] = true)
);
}

export default function ordinal(fields, settings) {
  const s = band();
  const values = fields[0].values();
  const uniq = unique(values).map(v => v.label);
  s.domain(uniq);
  s.range(settings.invert ? [1, 0] : [0, 1]);
  s.paddingOuter(1); // TODO hard-coded
  s.paddingInner(1); // TODO hard-coded
  s.align(0.5); // TODO hard-coded
  const fn = function (v) {
    return s.get(v.label);
  };

  fn.scale = s;

  return fn;
}
