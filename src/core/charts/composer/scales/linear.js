import { linear as lin } from '../../../scales/linear';
import { notNumber } from '../../../utils/undef';

const AVAILABLE_SETTINGS = ['min', 'max', 'expand', 'include', 'invert'];

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

function getMinMax(fields, settings) {
  const min = Number(settings.min);
  const max = Number(settings.max);
  let fieldMin = Math.min(...fields.map(m => m.min()));
  let fieldMax = Math.max(...fields.map(m => m.max()));

  if (isNaN(fieldMin) || isNaN(fieldMax)) {
    fieldMin = -1;
    fieldMax = 1;
  } else if (fieldMin === fieldMax && fieldMin === 0) {
    fieldMin = -1;
    fieldMax = 1;
  } else if (fieldMin === fieldMax && fieldMin) {
    fieldMin -= Math.abs(fieldMin * 0.1);
    fieldMax += Math.abs(fieldMax * 0.1);
  } else if (!isNaN(settings.expand)) {
    const range = fieldMax - fieldMin;
    fieldMin -= range * settings.expand;
    fieldMax += range * settings.expand;
  }

  if (Array.isArray(settings.include)) {
    const i = settings.include.filter(n => !isNaN(n));
    fieldMin = Math.min(...i, fieldMin);
    fieldMax = Math.max(...i, fieldMax);
  }

  return {
    min: !isNaN(min) ? min : fieldMin,
    max: !isNaN(max) ? max : fieldMax
  };
}

export function linear(fields, settings) {
  const s = lin();
  const stgns = generateSettings(fields, settings);
  const { min, max } = getMinMax(fields, stgns);
  s.domain([min, max]);
  s.range(stgns.invert ? [1, 0] : [0, 1]);
  const fn = v => notNumber(v.value) ? NaN : s.get(v.value);

  fn.scale = s;

  return fn;
}
