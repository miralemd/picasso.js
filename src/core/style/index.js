const globalDefaults = {
  fontFamily: 'Arial',
  fontSize: '13px',
  color: '#595959',
  fill: '#333333',
  backgroundColor: '#ffffff',
  stroke: '#000000',
  strokeWidth: 1
};

function getObject(root, steps) {
  let obj = root;
  for (let i = 0; i < steps.length; i++) {
    if (obj[steps[i]]) {
      obj = obj[steps[i]];
    } else {
      return undefined;
    }
  }
  return obj;
}

function wrapper(fallbackVal, fn, item, index, array) {
  const value = fn ? fn(item, index, array) : null;
  if (value !== null && typeof value !== 'undefined') {
    // Custom accessor returned a proper value
    return value;
  } else {
    // Fall back to fallback
    if (typeof fallbackVal === 'function') {
      // fallback is a function, run it
      return fallbackVal(item, index, array);
    } else if (fallbackVal && typeof fallbackVal.fn === 'function') {
      // fallback has a custom function, run it
      return fallbackVal.fn(item, index, array);
    } else {
      // fallback is a value, return it
      return fallbackVal;
    }
  }
}

function attr(targets, attribute, defaultVal, index) {
  const target = targets[index];
  if (!target) {
    return defaultVal;
  }
  const type = typeof target[attribute];


  if (type === 'undefined') {
    // undefined value
    if (index < targets.length - 1) {
      // check inheritance
      return attr(targets, attribute, defaultVal, index + 1);
    } else {
      // end of the chain, return default
      return defaultVal;
    }
  } else if (typeof target[attribute] === typeof defaultVal) {
    // constant value
    return target[attribute];
  }

  // custom accessor function
  if (type === 'function') {
    // Return object with fn and fallback attribute value
    return { fn: (...args) => wrapper(attr(targets, attribute, defaultVal, index + 1), target[attribute], ...args) };
  }
  // A composite object, for example a scale
  if (type === 'object') {
    if (typeof target[attribute].fn === 'function') {
      // custom accessor function inside object
      const fn = target[attribute].fn;
      target[attribute].fn = (...args) => wrapper(attr(targets, attribute, defaultVal, index + 1), fn, ...args);
    } else {
      // Add in the fallback attribute value as fn
      target[attribute].fn = (...args) => wrapper(attr(targets, attribute, defaultVal, index + 1), null, ...args);
    }

    return target[attribute];
  }
  return defaultVal;
}

function resolveAttribute(root, steps, attribute, defaultVal) {
  let i = steps.length;
  const targets = [];
  while (i >= 0) {
    targets.push(getObject(root, steps));
    steps.pop();
    i--;
  }

  return attr(targets, attribute, defaultVal, 0);
}
/**
* Resolves styles from multiple sources
* @private
* @param {object} defaults Default settings of the target property
* @param {object} settings Externally defined style root
* @param {string} propertyName Name of child property to access
* @returns {object} combined styles
* @example
* // returns { stroke: "#00f", strokeWidth: 2, fill: "red", width: {value: 999 fn: function} }
* resolveSettings(
*    {
*    stroke: "#000",
*    strokeWidth: 1,
*       fill: "red",
*       width: 999
*  },
*   {
*        stroke: "#f00",
*        strokeWidth: 2,
*        parts: {
*            rect: {
*                stroke: "#00f",
*                width: function( item ) { return item.x; }
*            },
*            label: { }
*        }
*    },
*    "parts.rect" );
*/
export function resolveStyle(defaults, styleRoot, path) {
  const steps = path ? path.split('.') : [];
  const ret = {};
  for (const s in defaults) {
    const def = defaults[s] === null || typeof defaults[s] === 'undefined' ? globalDefaults[s] : defaults[s];
    ret[s] = resolveAttribute(styleRoot, steps.concat(), s, def);
  }
  return ret;
}
