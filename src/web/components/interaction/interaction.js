/* global Hammer */

const translateKnownTypes = {
  click: 'Tap',
  Click: 'Tap'
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
 * Helper function for getting default non-hammer options. Currently only supporting 'click'
 * @param {String} type Gesture type
 * @param {Object} options Given options
 * @private
 */
function getDefaultOptions(type, options) {
  options.event = options.event || type.toLowerCase();
  return options;
}

const interactionComponent = {
  require: ['chart', 'instance'],
  mounted() {
    const mc = this.mc = new Hammer.Manager(this.chart.element);
    this.settings.actions.forEach((action) => {
      action.options = action.options || {};

      // bind correct instance to functions
      if (typeof action.options.enable === 'function') {
        action.options.enable = action.options.enable.bind(this.instance);
      }
      Object.keys(action.handlers).forEach((eventName) => {
        action.handlers[eventName] = action.handlers[eventName].bind(this.instance);
      });

      // set up gestures
      const type = getGestureType(action.type);
      if (Hammer[type]) {
        mc.add(new Hammer[type](getDefaultOptions(action.type, action.options)));
        Object.keys(action.handlers).forEach((eventName) => {
          mc.on(eventName, action.handlers[eventName]);
        });
      }

      // setup native events
      if (type.toLowerCase() === 'native') {
        Object.keys(action.handlers).forEach((eventName) => {
          this.chart.element.addEventListener(eventName, action.handlers[eventName]);
        });
      }
    });

    // setup mixing gestures
    this.settings.actions.forEach((action) => {
      if (action.recognizeWith) {
        mc.get(action.options.event || action.type.toLowerCase()).recognizeWith(action.recognizeWith.split(' '));
      }
      if (action.requireFailure) {
        mc.get(action.options.event || action.type.toLowerCase()).requireFailure(action.requireFailure.split(' '));
      }
    });
  },
  defaultSettings: {
    actions: []
  },
  render() {
    // functional component, do not have to render anything
  },
  updated() {
    this.settings.actions.forEach((action) => {
      if ((action.options || {}).enable && action.type.toLowerCase() === 'native') {
        let enable = typeof action.options.enable === 'function' ? action.options.enable() : action.options.enable;
        Object.keys(action.handlers).forEach((eventName) => {
          const listener = action.handlers[eventName];
          this.chart.element.removeEventListener(eventName, listener);
          if (enable) {
            this.chart.element.addEventListener(eventName, listener);
          }
        });
      }
    });
  },
  unmounted() {
    // unbind events
    this.mc.destroy();
    this.settings.actions.forEach((action) => {
      if (action.type.toLowerCase() === 'native') {
        Object.keys(action.handlers).forEach((eventName) => {
          this.chart.element.removeEventListener(eventName, action.handlers[eventName]);
        });
      }
    });
  }
};

export default interactionComponent;
