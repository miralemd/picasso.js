let heightMeasureCache = {},
  widthMeasureCache = {},
  canvasCache;

function measureTextWidth({ text, fontSize, fontFamily }) {
  const match = widthMeasureCache[text + fontSize + fontFamily];
  if (match !== undefined) {
    return match;
  }
  canvasCache = canvasCache || document.createElement('canvas');
  const g = canvasCache.getContext('2d');
  g.font = `${fontSize} ${fontFamily}`;
  const w = g.measureText(text).width;
  widthMeasureCache[text + fontSize + fontFamily] = w;
  return w;
}

function measureTextHeight({ fontSize, fontFamily }) {
  const match = heightMeasureCache[fontSize + fontFamily];

  if (match !== undefined) {
    return match;
  }
  const text = 'M';
  const height = measureTextWidth({ text, fontSize, fontFamily }) * 1.2;
  heightMeasureCache[fontSize + fontFamily] = height;
  return height;
}

/**
 * @param {object} opts
 * @param {string} opts.text - Text to measure
 * @param {string} opts.fontSize - Font size with a unit definition, ex. 'px' or 'em'
 * @param {string} opts.fontFamily - Font family
 * @return {object} Width and height of text in pixels
 * @example
 * measureText({
 *  text: 'my text',
 *  fontSize: '12px',
 *  fontFamily: 'Arial'
 * }); // returns { width: 20, height: 12 }
 */
export function measureText({ text, fontSize, fontFamily }) { // eslint-disable-line import/prefer-default-export
  const w = measureTextWidth({ text, fontSize, fontFamily });
  const h = measureTextHeight({ fontSize, fontFamily });
  return { width: w, height: h };
}
