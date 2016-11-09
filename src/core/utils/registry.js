class Registry {
  /**
   * @private
   * @example
   * var r = new Registry();
   * r.register( "marker", function( args ) {
   *   return new markers[args.type]( args );
   * } );
   *
   * r.build( {
   *   marker: {
   *     type: "point"
   *   }
   * } );
   *
   */
  constructor(reg) {
    this.registry = reg || {};
  }

  /**
   * Register a factory function
   * @deprecated - Use #add instead
   * @param name
   * @param fn
   */
  register(name, fn) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid name');
    }
    if (typeof fn !== 'function') {
      throw new TypeError('fn must be a function');
    }
    if (name in this.registry) {
      throw new Error(`${name} already exists`);
    }
    this.registry[name] = fn;
    return true;
  }

  add(name, fn) {
    return this.register(name, fn);
  }

  get(name) {
    return this.registry[name];
  }

  getKeys() {
    return Object.keys(this.registry);
  }

  has(name) {
    return !!this.registry[name];
  }

  remove(name) {
    let d = this.registry[name];
    delete this.registry[name];
    return d;
  }

  /**
   * Walk through obj properties and call factory function on registered properties
   * @returns {*}
   */
  build(obj, options) {
    let parts = {};

    for (let name in obj) {
      if (this.registry[name]) {
        parts[name] = this.registry[name](obj[name], options);
      }
    }

    return parts;
  }
}

export function registry(reg) {
  return new Registry(reg);
}

export default Registry;
