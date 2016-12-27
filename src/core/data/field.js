/* eslint no-return-assign: 0*/
import { formatter as formatterFn } from '../formatter';

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
  tags: data => data.tags,
  min: data => data.min,
  max: data => data.max,
  type: data => data.type,
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
  type = accessors.type,
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

  /**
   * Returns the current data used in this field.
   * @return {object}
   */
  fn.data = () => data;

  /**
   * Returns the tags.
   * @return {string[]}
   */
  fn.tags = () => tags(data);

  /**
   * Returns the type.
   * @return {string[]}
   */
  fn.type = () => type(data);

  /**
   * Returns the min value of this field.
   * @return {number}
   */
  fn.min = () => min(data);

  /**
   * Returns the max value of this field.
   * @return {number}
   */
  fn.max = () => max(data);

  /**
   * Returns this field's title.
   * @return {string} [description]
   */
  fn.title = () => title(data);

  /**
   * Returns the values of this field.
   * @return {object[]}
   */
  fn.values = () => values(data);

  /**
   * Returns a formatter adapted to the content of this field.
   */
  fn.formatter = () => formatter(data);

  return fn;
}
