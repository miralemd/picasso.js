/* eslint no-return-assign: 0 */
import field from './field';
import resolve from './json-path-resolver';

const fieldsFactory = (matrix) => {
  let headers = matrix[0]; // assume headers are in first row TODO - add headers config

  let content = matrix.slice(1);

  let ff = headers.map((a, i) => field({ id: `/${i}` })({
    title: headers[i],
    values: resolve(`//${i}`, content).map(v => ({ value: v, label: String(v), id: String(v) }))
  }));
  return ff;
};

const findField = (query, fields) => fields.filter(f => f.id() === query || f.title() === query)[0];

const accessors = {
  find: findField,
  fields: fieldsFactory
};

export default function table({
  id,
  fields = accessors.fields,
  find = accessors.find
} = {}) {
  let dd = {},
    cache = {};

  function fn(d) {
    dd = d;
    cache = {};
    return fn;
  }

  fn.data = () => dd;

  fn.id = () => id;

  fn.fields = () => {
    if (!cache.fields) {
      cache.fields = fields(dd);
    }
    return cache.fields;
  };

  fn.findField = query => find(query, fn.fields());

  return fn;
}
