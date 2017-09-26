import { resolveLineBreakAlgorithm } from './text-manipulation';

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

/**
 * Calculates the bounding rectangle of a text node.
 * The bounding rectangle is a approximate of the "em square" seen here (http://www.w3resource.com/html5-canvas/html5-canvas-text.php)
 * @param {object} attrs - Text node definition
 * @param {number} [attrs.x] - X-coordinate
 * @param {number} [attrs.y] - Y-coordinate
 * @param {number} [attrs.dx] - Delta x-coordinate
 * @param {number} [attrs.dy] - Delta y-coordinate
 * @param {string} [attrs.anchor] - Text anchor
 * @param {number} [attrs.maxWidth] - Maximum allowed text width
 * @return {object} The bounding rectangle
 */
function calcTextBounds(attrs, measureFn = measureText) {
  const fontSize = attrs['font-size'] || attrs.fontSize;
  const fontFamily = attrs['font-family'] || attrs.fontFamily;
  const textMeasure = measureFn({ text: attrs.text, fontFamily, fontSize });
  const calWidth = Math.min(attrs.maxWidth || textMeasure.width, textMeasure.width); // Use actual value if max is not set
  const x = attrs.x || 0;
  const y = attrs.y || 0;
  const dx = attrs.dx || 0;
  const dy = attrs.dy || 0;

  const boundingRect = {
    x: 0,
    y: (y + dy) - (textMeasure.height * 0.75), // Magic number for ideographic baseline
    width: calWidth,
    height: textMeasure.height
  };

  const anchor = attrs['text-anchor'] || attrs.anchor;

  if (anchor === 'middle') {
    boundingRect.x = (x + dx) - (calWidth / 2);
  } else if (anchor === 'end') {
    boundingRect.x = (x + dx) - calWidth;
  } else {
    boundingRect.x = x + dx;
  }

  return boundingRect;
}

/**
 * Calculates the bounding rectangle of a text node. Including any line breaks.
 * @param {object} node
 * @param {string} node.text - Text to measure
 * @param {number} [node.x=0] - X-coordinate
 * @param {number} [node.y=0] - Y-coordinate
 * @param {number} [node.dx=0] - Delta x-coordinate
 * @param {number} [node.dy=0] - Delta y-coordinate
 * @param {string} [node.anchor='start'] - Text anchor
 * @param {string} [node.fontSize] - Font size
 * @param {string} [node.fontFamily] - Font family
 * @param {string} [node['font-size']] - Font size
 * @param {string} [node['font-family']] - Font family
 * @param {string} [node.wordBreak] - Word-break option
 * @param {number} [node.maxWidth] - Maximum allowed text width
 * @param {number} [node.maxLines] - Maximum number of lines allowed
 * @param {number} [node.lineHeight=1.2] - Line height
 * @param {function} [measureFn] - Optional text measure function
 * @return {object} The bounding rectangle
 */
export function textBounds(node, measureFn = measureText) {
  const lineBreakFn = resolveLineBreakAlgorithm(node);
  if (lineBreakFn) {
    const bounds = calcTextBounds(node, measureFn);
    const fontSize = node['font-size'] || node.fontSize;
    const fontFamily = node['font-family'] || node.fontFamily;
    const resolvedLineBreaks = lineBreakFn(node, text => measureFn({ text, fontFamily, fontSize }));
    const lineHeight = node.lineHeight || 1.2;
    bounds.height = bounds.height * resolvedLineBreaks.lines.length * lineHeight;

    return bounds;
  }

  return calcTextBounds(node, measureFn);
}
