import { registry } from '../../../utils/registry';
import linear from '../../../scales/linear';
import ordinal from '../../../scales/ordinal';
import color from '../../../scales/color';

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

function deduceScaleTypeFromOptions(options, fields) {
  if (options.colors) {
    return 'color';
  } else if (fields[0]) {
    return getTypeFromMeta(fields[0]);
  }
  return 'linear';
}

export function create(options, dataset) {
  let sources = [];
  let fields = [];
  if (options.source) {
    sources = Array.isArray(options.source) ? options.source : [options.source];
    fields = findFields(dataset, sources);
  }
  let type = options.type || deduceScaleTypeFromOptions(options, fields);
  let s;

  if (reg.has(type)) {
    s = reg.get(type)(options, fields, dataset);
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
    if (Object.prototype.hasOwnProperty.call(obj, s)) {
      scales[s] = create(obj[s], composer.dataset());
    }
  }
  return scales;
}
