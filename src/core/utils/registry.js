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
   * @param key
   * @param fn
   */
  register(key, value) {
    return this.add(key, value);
  }

  add(key, value) {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key');
    }
    if (key in this.registry) {
      return false;
    }
    this.registry[key] = value;
    return true;
  }

  get(key) {
    return this.registry[key];
  }

  getKeys() {
    return Object.keys(this.registry);
  }

  getValues() {
    return Object.keys(this.registry).map(key => this.registry[key]);
  }

  has(key) {
    return !!this.registry[key];
  }

  remove(key) {
    const d = this.registry[key];
    delete this.registry[key];
    return d;
  }

  /**
   * Walk through obj properties and call factory function on registered properties
   * @returns {*}
   */
  build(obj, options) {
    const parts = {};

    for (const key in obj) {
      if (this.registry[key]) {
        parts[key] = this.registry[key](obj[key], options);
      }
    }

    return parts;
  }
}

export function registry(reg) {
  return new Registry(reg);
}

export default Registry;
