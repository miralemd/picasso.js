/* global Hammer */

const translateKnownTypes = {
  click: 'Tap',
  Click: 'Tap',
  tap: 'Tap',
  pan: 'Pan',
  swipe: 'Swipe',
  rotate: 'Rotate',
  press: 'Press',
  pinch: 'Pinch'
};

/**
 * Helper function for translating typical non-hammer gesture to a hammer gesture. Currently only supporting 'click'
 * @param {String} type Gesture type
 * @private
 */
function getGestureType(type) {
  return translateKnownTypes[type] || type;
}

/**
 * @private
 * removes all added hammer recognizers and native events
 */
function removeAddedHandlers() {
  // remove added native events
  this._native.forEach((native) => {
    Object.keys(native.handlers).forEach((eventName) => {
      this.chart.element.removeEventListener(eventName, native.handlers[eventName]);
    });
  });
  this._native = [];

  // remove hammer recognizers and registered events
  this._hammer.forEach((gesture) => {
    Object.keys(gesture.handlers).forEach((eventName) => {
      this.mc.off(eventName, gesture.handlers[eventName]);
    });
    this.mc.remove(gesture.options.event);
  });
  this._hammer = [];
}

/**
 * @private
 * add hammer recognizers and native events based on settings
 */
function addHandlers() {
  if (typeof this.settings.enable === 'function') {
    this.settings.enable = this.settings.enable.bind(this.instance)();
  }
  if (!this.settings.enable) {
    return; // interaction is disabled
  }
  this.settings.actions.forEach((action) => {
    action.options = action.options || {};
    // handle action enable
    if (action.options.enable === undefined) {
      action.options.enable = true;
    }
    if (typeof action.options.enable === 'function') {
      action.options.enable = action.options.enable.bind(this.instance)();
    }
    // setup hammer gestures
    const type = getGestureType(action.type);
    if (Hammer && Hammer[type]) {
      action.options.event = action.options.event || type.toLowerCase();
      this.mc = this.mc || new Hammer.Manager(this.chart.element);
      this.mc.add(new Hammer[type](action.options));
      Object.keys(action.handlers).forEach((eventName) => {
        action.handlers[eventName] = action.handlers[eventName].bind(this.instance);
        this.mc.on(eventName, action.handlers[eventName]);
      });
      this._hammer.push(action);
    }
    // setup native events
    if (type.toLowerCase() === 'native') {
      if (action.options.enable) {
        Object.keys(action.handlers).forEach((eventName) => {
          this.chart.element.addEventListener(eventName, action.handlers[eventName]);
        });
        this._native.push(action);
      }
    }
  });

  // setup mixing hammer gestures
  this.settings.actions.forEach((action) => {
    const type = getGestureType(action.type);
    if (Hammer && Hammer[type]) {
      if (action.recognizeWith) {
        this.mc.get(action.options.event).recognizeWith(action.recognizeWith.split(' '));
      }
      if (action.requireFailure) {
        this.mc.get(action.options.event).requireFailure(action.requireFailure.split(' '));
      }
    }
  });
}

const interactionComponent = {
  require: ['chart', 'instance'],
  created() {
    this._native = [];
    this._hammer = [];
  },
  mounted() {
    addHandlers.call(this);
  },
  defaultSettings: {
    enable: true,
    actions: []
  },
  render() {
    // functional component, do not have to render anything
  },
  updated() {
    removeAddedHandlers.call(this);
    addHandlers.call(this);
  },
  destroyed() {
    removeAddedHandlers.call(this);
    if (this.mc) {
      this.mc.destroy();
    }
  }
};

export default interactionComponent;
