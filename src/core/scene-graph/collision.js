export class Collision {
  constructor({ parent = null, node = null, input = null, bounds = null }) {
    this._parent = parent;
    this._node = node;
    this._input = input;
    this._bounds = bounds;
  }

  get bounds() {
    return this._bounds;
  }

  set parent(p) {
    this._parent = p;
  }

  get parent() {
    return this._parent;
  }

  get node() {
    return this._node;
  }

  get input() {
    return this._input;
  }

  set input(i) {
    this._input = i;
  }
}

export default function create(...a) {
  return new Collision(...a);
}
