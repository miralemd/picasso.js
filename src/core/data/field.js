/* eslint no-return-assign: 0*/
import { formatter as formatterFn } from '../formatter';

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
  tags: data => data.tags,
  min: data => data.min,
  max: data => data.max,
  title: data => data.title,
  values: data => data.values,
  formatter: () => formatterFn('d3')('number')('')
};

/**
 * Factory-function, constructs a new field accessor with default settings
 *
 * @return {Object}   Object with accessors
 */
export default function field({
  id,
  min = accessors.min,
  max = accessors.max,
  tags = accessors.tags,
  title = accessors.title,
  values = accessors.values,
  formatter = accessors.formatter
} = {}) {
  let data = {};

  function fn(d) {
    data = d;
    return fn;
  }

  fn.id = () => id;

  fn.data = () => data;

  fn.tags = () => tags(data);

  fn.min = () => min(data);

  fn.max = () => max(data);

  fn.title = () => title(data);

  fn.values = () => values(data);

  fn.formatter = () => formatter(data);

  return fn;
}
