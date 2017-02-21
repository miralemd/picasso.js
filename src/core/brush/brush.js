import EventEmitter from '../utils/event-emitter';

import rangeCollection from './range-collection';
import valueCollection from './value-collection';

function add({
  items,
  values,
  vc
}) {
  let changedMap = {};
  let changed = [];
  items.forEach(({ key, value }) => {
    if (!values[key]) {
      values[key] = vc();
    }

    if (values[key].add(value)) {
      changedMap[key] = changedMap[key] || [];
      changedMap[key].push(value);
    }
  });

  Object.keys(changedMap).forEach((key) => {
    changed.push({ id: key, values: changedMap[key] });
  });
  return changed;
}

function remove({
  items,
  values
}) {
  let changedMap = {};
  let changed = [];
  items.forEach(({ key, value }) => {
    if (!values[key]) {
      return;
    }

    if (values[key].remove(value)) {
      changedMap[key] = changedMap[key] || [];
      changedMap[key].push(value);
    }
  });

  Object.keys(changedMap).forEach((key) => {
    changed.push({ id: key, values: changedMap[key] });
  });
  return changed;
}

function collectUnique(items) {
  let filteredSet = {};
  items.forEach(({ key, value }) => {
    if (!filteredSet[key]) {
      filteredSet[key] = [];
    }
    let idx = filteredSet[key].indexOf(value);

    if (idx === -1) {
      filteredSet[key].push(value);
    } else {
      filteredSet[key].splice(idx, 1);
    }
  });
  return filteredSet;
}

function createValueCollection({
  key,
  collection,
  obj,
  fn,
  value
}) {
  if (!collection[key]) {
    collection[key] = fn();
  }
  obj[key] = obj[key] || [];
  obj[key].push(value);
  collection[key].add(value);
}

export function toggle({
  items,
  values,
  vc
}) {
  let addedMap = {};
  let removedMap = {};
  let added = [];
  let removed = [];
  let filteredSet = collectUnique(items);

  Object.keys(filteredSet).forEach((key) => {
    filteredSet[key].forEach((value) => {
      if (!values[key] || !values[key].contains(value)) {
        createValueCollection({
          key,
          value,
          collection: values,
          obj: addedMap,
          fn: vc
        });
      } else if (values[key] && values[key].contains(value)) {
        removedMap[key] = removedMap[key] || [];
        removedMap[key].push(value);
        values[key].remove(value);
      }
    });
  });

  Object.keys(addedMap).forEach((key) => {
    added.push({ id: key, values: addedMap[key] });
  });

  Object.keys(removedMap).forEach((key) => {
    removed.push({ id: key, values: removedMap[key] });
  });

  return [added, removed];
}

function diff(old, current) {
  let changed = [];
  Object.keys(old).forEach((key) => {
    if (!current[key]) {
      changed.push({ id: key, values: old[key] });
    } else {
      let changedValues = old[key].filter(v => current[key].indexOf(v) === -1);
      if (changedValues.length) {
        changed.push({ id: key, values: changedValues });
      }
    }
  });

  return changed;
}

export function set({
  items,
  vCollection,
  vc
}) {
  let addedMap = {};
  let added = [];
  let removed = [];
  let filteredSet = collectUnique(items);

  let oldMap = {};
  Object.keys(vCollection).forEach((key) => {
    oldMap[key] = vCollection[key].values().slice();
    delete vCollection[key];
  });

  Object.keys(filteredSet).forEach((key) => {
    filteredSet[key].forEach((value) => {
      if (!vCollection[key] || !vCollection[key].contains(value)) {
        createValueCollection({
          key,
          value,
          collection: vCollection,
          obj: addedMap,
          fn: vc
        });
      }
    });
  });

  removed = diff(oldMap, addedMap);
  added = diff(addedMap, oldMap);

  return [added, removed];
}

function intercept(handlers, items) {
  return handlers && handlers.length ? handlers.reduce((value, interceptor) => interceptor(value), items) : items;
}

export default function brush({
  vc = valueCollection,
  rc = rangeCollection
} = {}) {
  let activated = false;
  let ranges = {};
  let values = {};
  let interceptors = {
    addValues: [],
    removeValues: [],
    toggleValues: [],
    setValues: []
  };

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
    let removed = fn.brushes().filter(b => b.type === 'value').map(b => ({ id: b.id, values: b.brush.values() }));
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
    fn.addValues([{ key, value }]);
  };

  /**
   * @param {object[]} items Items to add
   */
  fn.addValues = (items) => {
    const its = intercept(interceptors.addValues, items);
    const added = add({
      vc,
      values,
      items: its
    });

    fn.emit('add-values', its);

    if (added.length) {
      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', added, []);
    }
  };

  /**
   * @param {object[]} items Items to set
   */
  fn.setValues = (items) => {
    const its = intercept(interceptors.setValues, items);
    let changed = set({
      items: its,
      vCollection: values,
      vc
    });

    fn.emit('set-values', its);

    if (changed[0].length > 0 || changed[1].length > 0) {
      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', changed[0], changed[1]);
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
    fn.removeValues([{ key, value }]);
  };

  /**
   * @param {object[]} items Items to remove
   */
  fn.removeValues = (items) => {
    const its = intercept(interceptors.removeValues, items);
    const removed = remove({
      values,
      items: its
    });

    fn.emit('remove-values', its);

    if (removed.length) {
      fn.emit('update', [], removed);
      // TODO - emit 'end' event if there are no remaining active brushes
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
    fn.toggleValues([{ key, value }]);
  };

  /**
   * @param {object[]} items Items to toggle
   */
  fn.toggleValues = (items) => {
    const its = intercept(interceptors.toggleValues, items);
    let toggled = toggle({
      items: its,
      values,
      vc
    });

    fn.emit('toggle-values', its);

    if (toggled[0].length > 0 || toggled[1].length > 0) {
      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', toggled[0], toggled[1]);
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

  fn.containsMappedData = (d, props, mode) => {
    let status = [];
    Object.keys(d).forEach((key, i) => {
      status[i] = { key, i, bool: false };
      let source = d[key].source && d[key].source.field;
      if (!source) {
        return;
      }

      let type = d[key].source.type === 'quant' ? 'range' : 'value';
      let value = d[key].value;
      if (type === 'range' && ranges[source] && ranges[source].containsValue(value)) {
        status[i].bool = true;
      } else if (type === 'value' && values[source] && values[source].contains(value)) {
        status[i].bool = true;
      }
    });

    if (props) {
      status = status.filter(b => props.indexOf(b.key) !== -1);
      if (mode === 'and') {
        return !!status.length && !status.some(s => s.bool === false);
      } else if (mode === 'xor') {
        return !!status.length && status.some(s => s.bool) && status.some(s => s.bool === false);
      }
      // !mode || mode === 'or'
      return status.some(s => s.bool);
    }
    return status.some(s => s.bool);
  };

  /**
   * Adds an event interceptor
   *
   * @param {string} name Name of the event to intercept
   * @param {function} ic Handler to call before event is triggered
   * @example
   * brush.intercept('add-values', items => {
   *  console.log('about to add the following items', items);
   *  return items;
   * });
   */
  fn.intercept = (name, ic) => {
    let s = name.replace(/(-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''));
    if (!interceptors[s]) {
      return;
    }
    interceptors[s].push(ic);
  };

  EventEmitter.mixin(fn);

  return fn;
}
