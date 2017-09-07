import resolve from './json-path-resolver';
import field from './field';
import extract from './extractor-matrix';

import { findField } from './util';

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

function createFields(matrix, { cache }) {
  if (!matrix) {
    return;
  }
  const headers = matrix[0]; // assume headers are in first row TODO - add headers config

  const content = matrix.slice(1);

  headers.forEach((a, i) => {
    const values = resolve(`//${i}`, content);
    const numericValues = filters.numeric(values);
    const isMeasure = numericValues.length > 0;
    const type = isMeasure ? 'measure' : 'dimension';
    const min = isMeasure ? Math.min(...numericValues) : NaN;
    const max = isMeasure ? Math.max(...numericValues) : NaN;
    // TODO Deal with tags

    cache.fields.push(field({
      title: headers[i],
      values,
      min,
      max,
      type,
      value: v => v
    }));
  });
}

/**
 * Create a new dataset with default settings
 * @alias dataset
 * @memberof picasso.data
 * @ignore
 * @return {dataset}
 */
export default function dataset(matrix) {
  const cache = {
    fields: []
  };

  const data = {
    raw: () => matrix,
    field: query => findField(query, {
      cache,
      matrix
    }),
    extract: config => extract(config, data, cache),
    hierarchy: () => null
  };

  createFields(matrix, {
    cache
  });

  return data;
}
