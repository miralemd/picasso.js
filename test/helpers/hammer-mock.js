import EventEmitter from '../../src/core/utils/event-emitter';

class Manager {
  constructor() {
    EventEmitter.mixin(this);
    this.gestures = [];
  }
  add(gesture) {
    this.gestures.push(gesture);
  }
  get(event) {
    for (let i = 0; i < this.gestures.length; ++i) {
      if (this.gestures[i].opts.event === event) {
        return this.gestures[i];
      }
    }
    return null;
  }
  destroy() {
    this.gestures = [];
    this.removeAllListeners();
  }
}

class BaseGesture {
  constructor(opts) {
    this.opts = opts;
  }
}

class Tap extends BaseGesture {}
class Pan extends BaseGesture {}

function hammerMock() {
  const Hammer = {};
  Hammer.Manager = Manager;
  Hammer.Tap = Tap;
  Hammer.Pan = Pan;
  global.Hammer = Hammer;
  return Hammer;
}

export default hammerMock;
