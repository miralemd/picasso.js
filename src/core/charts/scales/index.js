import { registry } from '../../utils/registry';
import linear from '../../scales/linear';
import band from '../../scales/band';
import sequential from '../../scales/color/sequential';
import threshold from '../../scales/color/threshold';

const reg = registry();

reg.add('linear', linear);
reg.add('band', band);
reg.add('sequential-color', sequential);
reg.add('threshold-color', threshold);

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

export function create(options, dataset) {
  let sources = [];
  let fields = [];
  if (options.source) {
    sources = Array.isArray(options.source) ? options.source : [options.source];
    fields = findFields(dataset, sources);
  }
  let type = options.type || deduceScaleTypeFromOptions(options, fields);
  let s;

  if (type === 'color') {
    type = 'sequential-color';
  }

  if (reg.has(type)) {
    s = reg.get(type);
    s = s(options, fields, dataset);
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

export default function builder(obj, chart) {
  const scales = {};
  for (const s in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, s)) {
      scales[s] = create(obj[s], chart.dataset());
    }
  }
  return scales;
}
