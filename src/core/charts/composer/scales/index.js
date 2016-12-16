import { registry } from '../../../utils/registry';
import linear from './linear';
import ordinal from './ordinal';
import color from './color';

const reg = registry();

reg.add('linear', linear);
reg.add('ordinal', ordinal);
reg.add('color', color);


function getTypeFromMeta(field) {
  return isNaN(field.min()) ? 'ordinal' : 'linear';
}

function findFields(dataset, sources) {
  return sources.map((s) => {
    const f = dataset.findField(s);
    return f ? f.field : undefined;
  });
}

export function create(options, dataset) {
  const sources = Array.isArray(options.source) ? options.source : [options.source];
  const fields = findFields(dataset, sources);
  let type = options.type;
  if (!type) {
    type = options.colors ? 'color' : getTypeFromMeta(fields[0]);
  }
  let s;

  if (reg.has(type)) {
    s = reg.get(type)(fields, options);
    s.type = type;
    s.sources = sources;
  }
  return s;
}

export function getOrCreateScale(v, scales, dataset) {
  let s;
  if (typeof v === 'string' && scales[v]) { // return by name
    s = scales[v];
  } else if (typeof v === 'object' && 'scale' in v && scales[v.scale]) { // return by { scale: "name" }
    s = scales[v.scale];
  }

  return s || create(v, dataset);
}

export default function builder(obj, composer) {
  const scales = {};
  for (const s in obj) {
    scales[s] = create(obj[s], composer.dataset());
  }
  return scales;
}
