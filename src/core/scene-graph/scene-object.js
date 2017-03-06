export class SceneObject {
  /**
   * Read-only object representing a node on the scene.
   */
  constructor(node) {
    this._bounds = node.boundingRect ? () => node.boundingRect(true) : () => ({ x: 0, y: 0, width: 0, height: 0 });
    this._attrs = node.attrs;
    this._type = node.type;
    this._data = node.data;
  }

  /**
   * Get the node type
   * @return {String} Node type
   */
  get type() {
    return this._type;
  }

  /**
   * Get the associated data
   * @return {String|Number|Object} Data
   */
  get data() {
    return this._data;
  }

  /**
   * Get the node attributes
   * @return {Object} Node attributes
   */
  get attrs() {
    return this._attrs;
  }

  /**
   * Get the element the scene is attached to
   * @return {HTMLElement} Element the scene is attached to
   */
  get element() {
    return this._element;
  }

  /**
  * Set the element the scene is attached to
  * @param  {HTMLElement} e Element the scene is attached to
  */
  set element(e) {
    this._element = e;
  }

  /**
   * Get bounding rectangle of the node.
   * Origin is in the top-left corner of the scene element.
   * @return {Object} Bounding rectangle of the node.
   */
  get bounds() {
    return this._bounds();
  }
}

export default function create(...a) {
  return new SceneObject(...a);
}
