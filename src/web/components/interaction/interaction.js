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
      if (typeof action.options.enable === 'function') {
        action.options.enable = action.options.enable.bind(this.instance);
      }
      const gestureType = getGestureType(action.type);
      if (Hammer[gestureType]) {
        mc.add(new Hammer[gestureType](getDefaultOptions(action.type, action.options)));
        Object.keys(action.handlers).forEach((eventName) => {
          mc.on(eventName, action.handlers[eventName].bind(this.instance));
        });
      }
    });
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
  destroyed() {
    this.mc.destroy();
  }
};

export default interactionComponent;
