import registry from '../../utils/registry';
import linear from '../../scales/linear';
import band from '../../scales/band';
import sequential from '../../scales/color/sequential';
import threshold from '../../scales/color/threshold';
import categorical from '../../scales/color/categorical';

const scaleRegistry = registry();

scaleRegistry('linear', linear);
scaleRegistry('band', band);
scaleRegistry('sequential-color', sequential);
scaleRegistry('threshold-color', threshold);
scaleRegistry('categorical-color', categorical);

export {
  scaleRegistry as default
};

function getTypeFromMeta(fields) {
  const types = fields.map(field => (field.type() === 'dimension' ? 'band' : 'linear'));
  return types.indexOf('linear') !== -1 ? 'linear' : 'band';
}

function findFields(dataset, sources) {
  return sources.map((s) => {
    const f = dataset.findField(s);
    return f ? f.field : undefined;
  });
}

function deduceScaleTypeFromOptions(options, fields) {
  if (fields[0]) {
    return getTypeFromMeta(fields);
  }
  return 'linear';
}

export function create(options, dataset, reg) {
  let sources = [];
  let fields = [];
  if (options.source) {
    sources = Array.isArray(options.source) ? options.source : [options.source];
    fields = findFields(dataset, sources);
  }
  let type = options.type || deduceScaleTypeFromOptions(options, fields);
  let s;

  if (type === 'color') {
    if (fields[0] && fields[0].type() === 'dimension') {
      type = 'categorical-color';
    } else {
      type = 'sequential-color';
    }
  }

  if (reg.has(type)) {
    s = reg.get(type);
    s = s(options, fields, dataset);
    s.type = type;
    s.sources = sources;
  }
  return s;
}

export function getOrCreateScale(v, scales, dataset, reg) {
  let s;
  if (typeof v === 'string' && scales[v]) { // return by name
    s = scales[v];
  } else if (typeof v === 'object' && 'scale' in v && scales[v.scale]) { // return by { scale: "name" }
    s = scales[v.scale];
  }

  return s || create(v, dataset, reg);
}

export function builder(obj, dataset, reg) {
  const scales = {};
  for (const s in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, s)) {
      scales[s] = create(obj[s], dataset, reg);
    }
  }
  return scales;
}
