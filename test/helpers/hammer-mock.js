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
      if (this.gestures[i].options.event === event) {
        return this.gestures[i];
      }
    }
    return null;
  }
  remove(gesture) {
    let i = 0;
    for (; i < this.gestures.length; ++i) {
      if (this.gestures[i].options.event === gesture) {
        break;
      }
    }
    this.gestures.splice(i, 1);
  }
  off(event, callback) {
    this.removeListener(event, callback);
  }
  destroy() {
    this.gestures = [];
    this.removeAllListeners();
  }
}

class BaseGesture {
  constructor(options) {
    this.options = options;
    this._recognizeWith = [];
    this._requireFailure = [];
  }
  set(options) {
    this.options = options;
  }
  recognizeWith(gestures) {
    this._recognizeWith = this._recognizeWith.concat(gestures);
  }

  requireFailure(gestures) {
    this._requireFailure = this._requireFailure.concat(gestures);
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
