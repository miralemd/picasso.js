
/**
 * Manages event handlers for native events
 */
export default function native(chart, mediator, element) {
  let instance = { chart, mediator, element };
  let nativeEvents = [];
  let settings;
  let itKey;
  let isOn = true;

  /**
   * Set default settings
   * @private
   */
  function setDefaultSettings(newSettings) {
    itKey = newSettings.key;
    settings = newSettings;
    settings.events = settings.events || [];
    if (settings.enable === undefined) {
      settings.enable = true;
    }
  }

  /**
   * Add native events based on settings
   * @private
   */
  function addEvents() {
    if (typeof settings.enable === 'function') {
      settings.enable = settings.enable.bind(instance)();
    }
    if (!settings.enable) {
      return; // interaction is disabled
    }
    Object.keys(settings.events).forEach((key) => {
      const listener = settings.events[key].bind(instance);
      element.addEventListener(key, listener);
      nativeEvents.push({ key, listener });
    });
  }

  /**
   * Removes all added native events
   * @private
   */
  function removeAddedEvents() {
    // remove added native events
    nativeEvents.forEach(({ key, listener }) => {
      element.removeEventListener(key, listener);
    });
    nativeEvents = [];
  }

  return {
    get key() {
      return itKey;
    },
    /**
     * Updates this with new settings
     */
    set(newSettings) {
      setDefaultSettings(newSettings);
      removeAddedEvents();
      if (isOn) {
        addEvents();
      }
    },
    /**
     * Turns off interactions
     */
    off() {
      isOn = false;
      removeAddedEvents();
    },
    /**
     * Turns off interactions
     */
    on() {
      isOn = true;
      if (nativeEvents.length === 0) {
        addEvents();
      }
    },
    /**
     * Destroys and unbinds all event handlers
     */
    destroy() {
      removeAddedEvents();
      instance = null;
    }
  };
}
