/* eslint no-return-assign: 0 */
import field from './field';
import resolve from './json-path-resolver';

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

const fieldsFactory = (matrix) => {
  let headers = matrix[0]; // assume headers are in first row TODO - add headers config

  let content = matrix.slice(1);

  let ff = headers.map((a, i) => {
    const values = resolve(`//${i}`, content);
    const numericValues = filters.numeric(values);
    const isMeasure = numericValues.length > 0;
    const type = isMeasure ? 'measure' : 'dimension';
    const min = isMeasure ? Math.min(...numericValues) : NaN;
    const max = isMeasure ? Math.max(...numericValues) : NaN;
    const normalizedValues = values.map(v => ({ value: v, label: String(v), id: String(v) }));
    // TODO Deal with tags

    return field({ id: `/${i}` })({
      title: headers[i],
      values: normalizedValues,
      min,
      max,
      type
    });
  });
  return ff;
};

const findField = (query, fields) => fields.filter(f => f.id() === query || f.title() === query)[0];

const accessors = {
  find: findField,
  fields: fieldsFactory
};

/**
 * Create a new table with default acessors
 * @alias table
 * @memberof picasso.data
 * @ignore
 * @return {table}
 */
export default function table({
  id,
  fields = accessors.fields,
  find = accessors.find
} = {}) {
  let dd = {},
    cache = {};

  /**
   * @alias table
   * @param {object} d Sets data content for this table
   */
  function fn(d) {
    dd = d;
    cache = {};
    return fn;
  }

  /**
   * Returns this table's data
   * @return {object}
   */
  fn.data = () => dd;

  /**
   * Returns this table's id
   * @return {string}
   */
  fn.id = () => id;

  /**
   * Returns the fields in this table
   * @return {field[]}
   */
  fn.fields = () => {
    if (!cache.fields) {
      cache.fields = fields(dd);
    }
    return cache.fields;
  };

  /**
   * Finds the field based on the specified query
   * @return {field}
   */
  fn.findField = query => find(query, fn.fields());

  return fn;
}
