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

  function fn() {}

  fn.start = () => {
    if (!activated) {
      activated = true;
      fn.emit('start');
    }
  };

  fn.end = () => {
    if (!activated) {
      return;
    }
    activated = false;
    fn.emit('end');
  };

  fn.isActive = () => activated;

  fn.clear = () => {
    ranges = {};
    values = {};
    fn.emit('update'); // TODO - do not emit update if state hasn't changed
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

  fn.addValue = (path, value) => {
    if (!values[path]) {
      values[path] = vc();
    }

    if (!activated) {
      activated = true;
      fn.emit('start');
    }

    if (values[path].add(value)) {
      fn.emit('update');
    }
  };

  fn.removeValue = (path, value) => {
    if (!values[path]) {
      return;
    }

    if (values[path].remove(value)) {
      fn.emit('update');
    }
  };

  fn.containsRangeValue = (path, value) => {
    if (!ranges[path]) {
      return false;
    }
    return ranges[path].containsValue(value);
  };

  fn.containsValue = (path, value) => {
    if (!values[path]) {
      return false;
    }
    return values[path].contains(value);
  };

  fn.containsMappedData = (d) => {
    let b = false;
    Object.keys(d).forEach((key) => {
      let source = d[key].source && d[key].source.field;
      if (!source) {
        return;
      }
      let type = typeof d[key].value === 'number' ? 'range' : 'value'; // TODO - store type in mapped data
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
