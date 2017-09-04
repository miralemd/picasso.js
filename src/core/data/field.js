/* eslint no-return-assign: 0*/
import formatterFn from '../formatter';

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
  tags: data => data.tags,
  min: data => data.min,
  max: data => data.max,
  type: data => data.type,
  title: data => data.title,
  values: data => data.values,
  value: v => v,
  formatter: () => formatterFn('d3-number')('')
};

/**
 * Create a new field with default settings
 * @alias field
 * @memberof picasso.data
 * @ignore
 * @return {field} Data field
 */
export default function field(data, {
  min = accessors.min,
  max = accessors.max,
  type = accessors.type,
  tags = accessors.tags,
  title = accessors.title,
  values = accessors.values,
  value = accessors.value,
  formatter = accessors.formatter
} = {}) {
  const f = {
    /**
     * Returns the current data used in this field.
     * @return {object}
     */
    data: () => data,

    /**
     * Returns the tags.
     * @return {string[]}
     */
    tags: () => tags(data),

    /**
     * Returns this field's type: 'dimension' or 'measure'.
     * @return {string}
     */
    type: () => type(data),

    /**
     * Returns the min value of this field.
     * @return {number}
     */
    min: () => min(data),

    /**
     * Returns the max value of this field.
     * @return {number}
     */
    max: () => max(data),

    /**
     * Returns this field's title.
     * @return {string} [description]
     */
    title: () => title(data),

    /**
     * Returns the values of this field.
     * @return {object[]}
     */
    items: () => values(data),

    /**
     * Returns a formatter adapted to the content of this field.
     */
    formatter: () => formatter(data),

    value
  };

  return f;
}
