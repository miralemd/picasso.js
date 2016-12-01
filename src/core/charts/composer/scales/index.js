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

function fieldFinder(query, field) {
  return field.title() === query;
}

function findFields(table, source) {
  if (Array.isArray(source)) {
    return source.map(s => table.findField(s, fieldFinder));
  } else {
    return [table.findField(source, fieldFinder)];
  }
}

export function create(options, tables) {
  const sources = Array.isArray(options.source) ? options.source : [options.source];
  const fields = findFields(tables[0], sources);
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

export function getOrCreateScale(v, scales, tables) {
  let s;
  if (typeof v === 'string' && scales[v]) { // return by name
    s = scales[v];
  } else if (typeof v === 'object' && 'scale' in v && scales[v.scale]) { // return by { scale: "name" }
    s = scales[v.scale];
  }

  return s || create(v, tables);
}

export function builder(obj, composer) {
  const scales = {};
  for (const s in obj) {
    scales[s] = create(obj[s], [composer.table()]);
  }
  return scales;
}
