/* eslint no-return-assign: 0*/
import formatterFn from '../formatter';

// TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

const accessors = {
  id: data => `${data.source}/${data.title}`,
  key: data => data.title,
  tags: data => data.tags,
  min: data => data.min,
  max: data => data.max,
  type: data => data.type,
  title: data => data.title,
  values: data => data.values,
  value: v => v,
  formatter: data => ((data.formatter && data.formatter()) || formatterFn('d3-number')(''))
};

/**
 * Create a new field with default settings
 * @ignore
 * @return {field} Data field
 */
export default function field(data, {
  id = accessors.id,
  key = accessors.key,
  min = accessors.min,
  max = accessors.max,
  type = accessors.type,
  tags = accessors.tags,
  title = accessors.title,
  values = accessors.values,
  value = accessors.value,
  formatter = accessors.formatter
} = {}) {
  /**
   * @alias field
   * @typedef {object}
   */
  const f = {

    /**
     * Returns this field's id
     * @returns {string}
     */
    id: () => id(data),

    /**
     * Returns this field's key
     * @returns {string}
     */
    key: () => key(data),
    /**
     * Returns the tags.
     * @return {Array<string>}
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
     * @return {Array<datum-extract>}
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
