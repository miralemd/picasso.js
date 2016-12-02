/* eslint no-return-assign: 0*/
import { formatter } from '../formatter';

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
  tags: data => data.tags,
  min: data => data.min,
  max: data => data.max,
  title: data => data.title,
  values: data => data.values,
  formatter: () => formatter('d3')('number')('')
};

/**
 * Factory-function, constructs a new field accessor with default settings
 *
 * @return {Object}   Object with accessors
 */
export default function field() {
  let data = {},
    acc = {
      min: accessors.min,
      max: accessors.max,
      tags: accessors.tags,
      title: accessors.title,
      values: accessors.values,
      formatter: accessors.formatter
    };

  function fn() {}

  /**
   * Get or set the data
   *
   * @param  {Object} [d] Data object
   * @return {Function}   Field object
   * @return {Object}     Data object
   */
  fn.data = d => d ? (data = d, fn) : data;

  /**
   * Get tags from the data or set an accessor for the tags
   *
   * @param  {Function} [f] Optional accessor function
   * @return {Function}     Field object
   * @return {Object}       Tags
   */
  fn.tags = f => f ? (acc.tags = f, fn) : acc.tags(data);

  /**
   * Get the minimum value of the data or set the accessor
   *
   * @param  {Function} [f] Optional accessor function
   * @return {Function}     Field object
   * @return {Integer}      The minimum value
   */
  fn.min = f => f ? (acc.min = f, fn) : acc.min(data);

  /**
   * Get the maximum value of the data or set the accessor
   *
   * @param  {Function} [f] Optional accessor function
   * @return {Function}     Field object
   * @return {Integer}      The maximum value
   */
  fn.max = f => f ? (acc.max = f, fn) : acc.max(data);

  /**
   * Get the title of the data or set the accessor
   *
   * @param  {Function} [f] Optional accessor function
   * @return {Function}     Field object
   * @return {String}       Title
   */
  fn.title = f => f ? (acc.title = f, fn) : acc.title(data);

  /**
   * Get the values of the data or set the accessor
   *
   * @param  {Function} [f] Optional accessor function
   * @return {Function}     Field object
   * @return {Array}        Array, array of objects or object of values
   */
  fn.values = f => f ? (acc.values = f, fn) : acc.values(data);

  /**
   * Get the formatted data of the data or set the formatter
   *
   * @param  {Function} [f] Optional formatter function
   * @return {Function}     Field object
   * @return {String}       Formatted data
   */
  fn.formatter = f => f ? (acc.formatter = f, fn) : acc.formatter(data);

  return fn;
}
