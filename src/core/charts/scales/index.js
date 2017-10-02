import registry from '../../utils/registry';
import linear from '../../scales/linear';
import band from '../../scales/band';
import sequential from '../../scales/color/sequential';
import threshold from '../../scales/color/threshold';
import categorical from '../../scales/color/categorical';
import extractData from '../../data/extractor';

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

function deduceScaleTypeFromOptions(options, fields) {
  if (fields && fields[0]) {
    return getTypeFromMeta(fields);
  }
  return 'linear';
}

export function create(options, dataset, deps) {
  let dataSourceConfig = options.data;
  if (options.source) { // DEPRECATION
    deps.logger.warn('Deprecated: Scale data source configuration');
    dataSourceConfig = {
      extract: []
    };
    (Array.isArray(options.source) ? options.source : [options.source]).forEach((source) => {
      dataSourceConfig.extract.push({
        field: source
      });
    });
  }
  let sources = [];
  let data = extractData(dataSourceConfig, dataset, deps);
  let type = options.type || deduceScaleTypeFromOptions(options, data.fields);
  let s;

  if (type === 'color') {
    if (data.fields && data.fields[0] && data.fields[0].type() === 'dimension') {
      type = 'categorical-color';
    } else {
      type = 'sequential-color';
    }
  }

  if (deps.scale.has(type)) {
    s = deps.scale.get(type);
    s = s(options, data, deps);
    s.type = type;
    s.sources = sources;
  }
  return s;
}

export function getOrCreateScale(v, scales, dataset, deps) {
  let s;
  if (typeof v === 'string' && scales[v]) { // return by name
    s = scales[v];
  } else if (typeof v === 'object' && 'scale' in v && scales[v.scale]) { // return by { scale: "name" }
    s = scales[v.scale];
  }

  return s || create(v, dataset, deps);
}

export function builder(obj, dataset, deps) {
  const scales = {};
  for (const s in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, s)) {
      scales[s] = create(obj[s], dataset, deps);
    }
  }
  return scales;
}
