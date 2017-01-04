import EventEmitter from '../utils/event-emitter';

import rangeCollection from './range-collection';
import valueCollection from './value-collection';

export default function brush({
  vc = valueCollection,
  rc = rangeCollection
} = {}) {
  let activated = false;
  let ranges = {};
  let values = {};

  /**
   * The brush context
   * @alias brush
   */
  function fn() {}

  /**
   * Starts this brush context
   *
   * Starts this brush context and emits a 'start' event if it is not already started.
   * @emits start
   */
  fn.start = () => {
    if (!activated) {
      activated = true;
      fn.emit('start');
    }
  };

  /**
   * Ends this brush context
   *
   * Ends this brush context and emits an 'end' event if it is not already ended.
   * @emits start
   */
  fn.end = () => {
    if (!activated) {
      return;
    }
    activated = false;
    fn.emit('end');
  };

  /**
   * Checks if this brush is activated
   *
   * Returns true if started, false otherwise
   * @return {boolean}
   */
  fn.isActive = () => activated;

  /**
   * Clears this brush context
   */
  fn.clear = () => {
    const hasChanged = Object.keys(ranges).length + Object.keys(values).length > 0;
    let removed = fn.brushes().filter(b => b.type === 'value').map(b => ({ id: b.id, values: b.values }));
    ranges = {};
    values = {};
    if (hasChanged) {
      fn.emit('update', [], removed); // TODO - do not emit update if state hasn't changed
    }
  };

  /**
   * Returns all brushes within this context
   * @return {object}
   */
  fn.brushes = () => {
    let result = [];
    result = result.concat(Object.keys(ranges).map(key => ({
      type: 'range',
      id: key,
      brush: ranges[key]
    })));

    result = result.concat(Object.keys(values).map(key => ({
      type: 'value',
      id: key,
      brush: values[key]
    })));

    return result;
  };

  /**
   * Adds a primitive value to this brush context
   *
   * If this brush context is not started, a 'start' event is emitted.
   * If the state of the brush changes, ie. if the added value does not already exist, an 'update' event is emitted.
   *
   * @param {string} key  An identifier that represents the data source of the value
   * @param {string|number} value The value to add
   * @emits start
   * @emits update
   * @example
   * brush.addValue('countries', 'Sweden');
   * brush.addValue('/qHyperCube/qDimensionInfo/0', 3);
   */
  fn.addValue = (key, value) => {
    if (!values[key]) {
      values[key] = vc();
    }

    if (!activated) {
      activated = true;
      fn.emit('start');
    }

    if (values[key].add(value)) {
      fn.emit('update', [{ id: key, values: [value] }], []);
    }
  };

  /**
   * Removes a primitive values from this brush context
   *
   * If the state of the brush changes, ie. if the removed value does exist, an 'update' event is emitted.
   *
   * @param  {string} key  An identifier that represents the data source of the value
   * @param  {string|number} value The value to remove
   * @example
   * brush.removeValue('countries', 'Sweden');
   */
  fn.removeValue = (key, value) => {
    if (!values[key]) {
      return;
    }

    if (values[key].remove(value)) {
      fn.emit('update', [], [{ id: key, values: [value] }]);
    }
  };

  /**
   * Toggles a primitive value in this brush context
   *
   * If the given value exist in this brush context, it will be removed. If it does not exist it will be added.
   *
   * @param  {string} key  An identifier that represents the data source of the value
   * @param  {string|number} value The value to toggle
   * @example
   * brush.toggleValue('countries', 'Sweden');
   */
  fn.toggleValue = (key, value) => {
    if (!values[key] || !values[key].contains(value)) {
      fn.addValue(key, value);
    } else {
      fn.removeValue(key, value);
    }
  };

  /**
   * Checks if a certain value exists in this brush context
   *
   * Returns true if the values exists for the provided key, returns false otherwise.
   *
   * @param  {string} key  An identifier that represents the data source of the value
   * @param  {string|number} value The value to check for
   * @return {boolean}
   * @example
   * brush.addValue('countries', 'Sweden');
   * brush.containsValue('countries', 'Sweden'); // true
   * brush.toggleValue('countries', 'Sweden'); // remove 'Sweden'
   * brush.containsValue('countries', 'Sweden'); // false
   */
  fn.containsValue = (key, value) => {
    if (!values[key]) {
      return false;
    }
    return values[key].contains(value);
  };

  fn.addRange = (path, r) => {
    if (!ranges[path]) {
      ranges[path] = rc();
    }

    if (!activated) {
      activated = true;
      fn.emit('start');
    }

    ranges[path].add(r);
    fn.emit('update'); // TODO - do not emit update if state hasn't changed
  };

  fn.containsRangeValue = (path, value) => {
    if (!ranges[path]) {
      return false;
    }
    return ranges[path].containsValue(value);
  };

  fn.containsMappedData = (d) => {
    let b = false;
    Object.keys(d).forEach((key) => {
      let source = d[key].source && d[key].source.field;
      if (!source) {
        return;
      }
      let type = d[key].source.type === 'quant' ? 'range' : 'value';
      if (type === 'range' && ranges[source] && ranges[source].containsValue(d[key].value)) {
        b = true;
      } else if (type === 'value' && values[source] && values[source].contains(d[key].value)) {
        b = true;
      }
    });
    return b;
  };

  EventEmitter.mixin(fn);

  return fn;
}
