/**
 * Resolves the value at the given JSON path
 * @private
 * @param  {String} path [description]
 * @param  {Object} obj  [description]
 * @return {Object}      [description]
 *
 * @example
 * let path = "/path/to/paradise";
 * let obj = {
 *   path: {
 *     to: { paradise: "heaven"},
 *     from: {...}
 *   }
 * };
 * resolve( path, obj ); // "heaven"
 */
export default function resolve(path, obj) {
  let arr = path.replace(/^\//, '').split(/\//),
    container = obj;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i] && Array.isArray(container)) {
      return container.map(v =>
   resolve(arr.slice(i + 1).join('/'), v)
);
    } else if (arr[i] in container) {
      container = container[arr[i]];
    }
  }

  return container;
}
