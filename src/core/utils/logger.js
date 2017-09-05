const LOG_LEVEL = {
  OFF: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

const logger = ({
  level = LOG_LEVEL.OFF,
  pipe = console
} = {}) => {
  let currentlevel = level;

  const LOG_FN = {
    [LOG_LEVEL.OFF]: () => {},
    [LOG_LEVEL.ERROR]: (...args) => pipe.error(...args),
    [LOG_LEVEL.WARN]: (...args) => pipe.warn(...args),
    [LOG_LEVEL.INFO]: (...args) => pipe.info(...args),
    [LOG_LEVEL.DEBUG]: (...args) => pipe.log(...args)
  };

  const log = (lev, ...args) => {
    if (!lev || currentlevel < lev) { return; }

    (LOG_FN[lev] || LOG_FN[LOG_LEVEL.DEBUG])(...args);
  };

  return {
    /**
     * Log a message
     * @param {number} lev - The log level
     * @param {...*} args
     */
    log,

    /**
     * Log an error message
     * @param {...*} args
     */
    error: (...args) => log(LOG_LEVEL.ERROR, ...args),

    /**
     * Log a warning message
     * @param {...*} args
     */
    warn: (...args) => log(LOG_LEVEL.WARN, ...args),

    /**
     * Log an info message
     * @param {...*} args
     */
    info: (...args) => log(LOG_LEVEL.INFO, ...args),

    /**
     * Log a debug message
     * @param {...*} args
     */
    debug: (...args) => log(LOG_LEVEL.DEBUG, ...args),

    /**
     * Set the current log level
     * @param {number} lev - The log level
     */
    level: (lev) => {
      if (typeof lev === 'number') {
        currentlevel = lev;
      }
      return currentlevel;
    },

    LOG_LEVEL
  };
};

export {
  logger as default
};
