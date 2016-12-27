import tableFn from './table';
import { mapData } from './data-mapper';

function tablesFn(data) {
  return data.map((tableData, i) => tableFn({ id: `/${i}` })(tableData));
}

function findField(path, tables) {
  let table = tables.filter(t => path.indexOf(t.id()) === 0)[0];
  let field;
  if (table) {
    let subpath = path.replace(table.id(), '');
    field = table.findField(subpath);
  }
  return {
    table,
    field
  };
}

export default function dataset({
  tables = tablesFn
} = {}) {
  let cache = {},
    data = [];

  function ds(d) {
    data = d;
    cache = {};
    return ds;
  }

  /**
   * Get all tables in this dataset
   * @return {table[]} All tables found in this dataset
   */
  ds.tables = () => {
    if (!cache.tables) {
      cache.tables = tables(data);
    }
    return cache.tables;
  };

  /**
   * Find a table in this dataset
   * @param  {string} query Table identifier
   * @return {table}       A table
   */
  ds.table = query => ds.tables().filter(t => t.id() === query)[0];

  ds.findField = query => findField(query, ds.tables());

  /**
   * Map data from multiple sources into a specified structure
   * @param  {data-map} mapper   An object specifing how to map the data
   * @param  {data-repeater} repeater An object specifing which data to loop over when aggregating
   * @return {object[]}          Mapped data
   * @example
   * ds.map({
   *  x: { field: '/qHyperCube/qMeasureInfo/1', reducer: 'sum' }
   *  y: { field: '/qHyperCube/qMeasureInfo/2', reducer: 'avg' },
   *  me: { field: '/qHyperCube/qDimensionInfo/1', reducer: 'first', type: 'qual' },
   *  parent: { field: '/qHyperCube/qDimensionInfo/0', reducer: 'first', type: 'qual' }
   * }, {
   *  field: '/qHyperCube/qDimensionInfo/1
   * });
   * // output:
   * // [
   * //   {
   * //     x: { value: 234, source: {...} },
   * //     y: { value: 12, source: {...} },
   * //     me: { value: 'Jan', source: {...} },
   * //     parent: { value: '2012', source: {...} },
   * //   },
   * //   {
   * //     x: { value: 212, source: {...} },
   * //     y: { value: 5, source: {...} },
   * //     me: { value: 'Feb', source: {...} },
   * //     parent: { value: '2012', source: {...} },
   * //   }
   * // ]
   */
  ds.map = (mapper, repeater) => mapData(mapper, repeater, ds);

  return ds;
}

/**
 * @typedef data-map
 * @property {string} field Path to a field
 * @property {string} [reducer='sum'] Option to specify how to reduce values
 */

/**
 * @typedef data-repeater
 * @property {string} field Path to a field
 * @property {string} [attribute] Attribute to use as identifier when collecting data
 */
