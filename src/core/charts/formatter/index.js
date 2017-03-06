import { formatter } from '../../formatter';

function fieldFinder(query, field) {
  return field.title() === query;
}

export function create(options, dataset) {
  // TODO Have some magic to handle and merge formatters from multiple sources

  if (options.source) {
    const match = dataset.findField(options.source, fieldFinder);

    if (match && typeof match.field !== 'undefined') {
      return match.field.formatter();
    }
  }

  return formatter(options.formatter || 'd3')(options.type || 'number')(options.format || '');
      // .locale( options.locale || {} );
}

export default function builder(obj, composer) {
  const formatters = {};
  for (const f in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, f)) {
      formatters[f] = create(obj[f], composer.dataset());
    }
  }
  return formatters;
}

export function getOrCreateFormatter(v, formatters, dataset) {
  let f;
  if (typeof v === 'string' && formatters[v]) { // return by name
    f = formatters[v];
  } else if (typeof v === 'object' && 'formatter' in v && formatters[v.formatter]) { // return by { formatter: "name" }
    f = formatters[v.formatter];
  }

  return f || create(v, dataset);
}
