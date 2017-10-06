import resolve from './json-path-resolver';
import field from './field';
import extract from './extractor-matrix';

import { findField, getPropsInfo } from './util';

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
 * @ignore
 * @return {dataset}
 */
export default function ds({
  key,
  data
} = {}) {
  const cache = {
    fields: []
  };

  /**
   * @alias dataset
   * @typedef {object}
   */
  const dataset = {
    /**
     * Get the key identifying this dataset
     * @returns {string}
     */
    key: () => key,

    /**
     * Get the raw data
     * @returns {any}
     */
    raw: () => data,

    /**
     * Find a field within this dataset
     * @param {string} query - The field to find
     * @returns {field}
     */
    field: query => findField(query, {
      cache,
      matrix: data
    }),

    /**
     * Get all fields within this dataset
     * @returns {Array<field>}
     */
    fields: () => cache.fields.slice(),

    /**
     * Extract data items from this dataset
     * @param {data-extract-config} config
     * @returns {Array<datum-extract>}
     */
    extract: config => extract(config, dataset, cache),

    /**
     * @returns {null}
     */
    hierarchy: () => null
  };

  createFields(data, {
    cache
  });

  return dataset;
}

ds.normalizeProperties = getPropsInfo;

/**
 * @typedef {object} data-extract-config
 * @property {string} field - The field to extract data from
 * @property {function} value - The field value accessor
 * @property {object} props - Additional properties to add to the extracted item
 */

/**
 * @typedef {object} datum-extract
 * @property {any} value - The extracted value
 * @property {object} source - The data source of the extracted data
 * @property {string} source.key - The data-source key
 * @property {string} source.field - The source field
 */
