/* eslint no-return-assign: 0 */
export function table() {
  let dd = {},
    cache = {},
    acc = {
      rows: () => 0,
      cols: () => 0,
      fields: () => []
    };

  function fn() {}

  fn.data = function (d) {
    if (d) {
      delete cache.fields;
      dd = d;
      return fn;
    }
    return dd;
  };

  fn.rows = function (f) {
    return f ? (acc.rows = f, fn) : acc.rows(dd);
  };

  fn.cols = function (f) {
    return f ? (acc.cols = f, fn) : acc.cols(dd);
  };

  fn.fields = function (f) {
    if (f) {
      acc.fields = f;
      delete cache.fields;
      return fn;
    }
    if (!cache.fields) {
      cache.fields = acc.fields(dd);
    }
    return cache.fields;
  };

  fn.findField = function (s, comparison) {
    const ff = fn.fields().filter(field => comparison(s, field));
    return ff[0];
  };

  return fn;
}
