import extend from 'extend';

/**
 * Creates a context. Input an array of strings that should be inherited by the context.
 *
 * @param  {Array}  [whitelist=[]]  An array of whitelisted string keys to inherit
 * @return {Function}               A context function
 */
export default function contextFactory(whitelist = []) {
  let contexts = [{}];

  /**
   * Returns the current context as an object. The object is mutable.
   *
   * @return {Object}   Current context
   */
  function context() {
    // Returns the current context, the last in the stack.
    let item = contexts[contexts.length - 1];
    return item;
  }

  /**
   * Call context.save() to save the current context and move down the stack.
   *
   * @param  {Object} [item={}]   Optional item to save.
   * @return {Object}             The current context, just as context()
   */
  context.save = function save(item = {}) {
    let current = context();
    let obj = {};
    let key = '';

    // Only inherit whitelisted properties
    for (let i = 0; i < whitelist.length; i++) {
      key = whitelist[i];
      obj[key] = current[key];
    }

    // Extend the new object with the saved item
    extend(obj, item);

    // Push it to the stack
    contexts.push(obj);

    // Return the new current context
    return context();
  };

  /**
   * Restore the previous context. Returns the context.
   *
   * @return {Object}   Returns the current context, just as context()
   */
  context.restore = function restore() {
    // Pop the last element from the stack
    contexts.pop();

    // Return the new current context
    return context();
  };

  return context;
}
