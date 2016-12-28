import crispify from './crispifier';

class Transposer {
  /**
   * @private
   */
  constructor(...items) {
    this.reset();

    this.push(...items);
  }

  /**
   * Evaluate a key for a transposed coordinate
   *
   * @param  {String} key   Key
   * @return {String}         Actual key
   */
  evaluateKey(key) {
    if (this.vertical) {
      const firstChar = key.substring(0, 1);
      const rest = key.substring(1);

      if (firstChar === 'x') {
        return `y${rest}`;
      } else if (firstChar === 'y') {
        return `x${rest}`;
      } else if (key === 'cx') {
        return 'cy';
      } else if (key === 'cy') {
        return 'cx';
      } else if (key === 'width') {
        return 'height';
      } else if (key === 'height') {
        return 'width';
      }
    }

    return key;
  }

  /**
   * Transpose a coordinate according to this.vertical and
   * the available rendering area
   *
   * @param  {String} key        The key of the coordinate to transpose
   * @param  {Number} coordinate The coordinate
   * @return {Number}            The actual location of the coordinate
   */
  transposeCoordinate(key, coordinate) {
    if (typeof coordinate === 'number' && isFinite(coordinate)) {
      const firstChar = key.substring(0, 1);

      if (firstChar === 'x' || key === 'cx') {
        return coordinate * this.width;
      } else if (key === 'width' || key === 'r') {
        return coordinate * this.width;
      } else if (firstChar === 'y' || key === 'cy') {
        return coordinate * this.height;
      } else if (key === 'height') {
        return coordinate * this.height;
      }
    }

    return coordinate;
  }

  /**
   * Push an item into the storage of the transposer
   *
   * @param  {Object} items An item to be drawed
   * @return {Object}       Can be chained
   */
  push(...items) {
    this.storage.push(...items);
    return this;
  }

  /**
   * Get the output of the transposer
   *
   * @return {Array}   Array of objects
   */
  output() {
    let items = this.storage.map((item) => {
      let newItem = {};

      Object.keys(item).forEach((key) => {
        const nkey = this.evaluateKey(key);
        const nval = this.transposeCoordinate(nkey, item[key]);
        newItem[nkey] = nval;
      });

      if (this.crisp) {
        crispify(newItem);
      }

      return newItem;
    });

    return items;
  }

  /**
   * Reset the transposer
   *
   * @return {Undefined}  Does not return anything
   */
  reset() {
    this.storage = [];
    this.vertical = false;
    this.crisp = false;

    this.flipX = false;
    this.flipY = false;

    this.width = 0;
    this.height = 0;
  }
}

export function transposer(...items) {
  return new Transposer(...items);
}

export default Transposer;
