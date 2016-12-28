import { band } from '../../../scales/band';

const AVAILABLE_SETTINGS = [
  'padding',
  'paddingOuter',
  'paddingInner',
  'align',
  'invert'
];

function unique(values) {
  const exists = {};
  return values.filter((v) => {
    if (exists[v.id]) {
      return false;
    }
    return (exists[v.id] = true);
  });
}

function evalSetting(fields, settings, name) {
  if (typeof settings[name] === 'function') {
    return settings[name](fields);
  }

  return settings[name];
}

function generateSettings(fields, settings) {
  const calcSettings = {};
  AVAILABLE_SETTINGS.forEach((s) => {
    calcSettings[s] = evalSetting(fields, settings, s);
  });
  return calcSettings;
}

export default function ordinal(fields, settings) {
  const s = band();
  const values = fields[0].values();
  const stgns = generateSettings(fields, settings);
  const uniq = unique(values).map(v => v.label);
  s.domain(uniq);
  s.range(stgns.invert ? [1, 0] : [0, 1]);

  s.padding(isNaN(stgns.padding) ? 1 : stgns.padding);
  if (!isNaN(stgns.paddingInner)) s.paddingInner(stgns.paddingInner);
  if (!isNaN(stgns.paddingOuter)) s.paddingOuter(stgns.paddingOuter);
  s.align(isNaN(stgns.align) ? 0.5 : stgns.align);

  const fn = v => s.get('label' in v ? v.label : v.value);

  fn.scale = s;

  return fn;
}
