/**
 * Get the minimum viable number out of multiple ones
 *
 * @param {...number} numberList - Multiple numbers i.e. 12, 15, NaN, 22
 * @return {number} - Returns the smallest viable number, i.e. 12
 */
export function getMinimumViableNumber(...numberList) {
  numberList = numberList.filter(obj => typeof (obj) === 'number' && !isNaN(obj));
  return Math.min(...numberList);
}

/**
 * Resolve PADDING object, number or string
 *
 * @param  {number|object|string} PADDING - Multiple formats
 * @return {object} - Returns padding object with correct top, right, bottom, left and width/height
 */
export function resolvePadding(padding) {
  if (typeof padding === 'object' && padding !== null) {
    const output = {};
    output.top = parseFloat(padding.top || 0);
    output.right = parseFloat((typeof padding.right === 'undefined' || isNaN(padding.right) ? output.top : padding.right) || 0);
    output.bottom = parseFloat((typeof padding.bottom === 'undefined' || isNaN(padding.bottom) ? output.top : padding.bottom) || 0);
    output.left = parseFloat((typeof padding.left === 'undefined' || isNaN(padding.left) ? output.right : padding.left) || 0);

    output.width = output.left + output.right;
    output.height = output.top + output.bottom;

    return output;
  } else if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
      width: padding * 2,
      height: padding * 2
    };
  } else if (typeof padding === 'string') {
    const parts = padding.replace(/px/gi, '').split(' ');

    return resolvePadding({
      top: parts[0],
      right: parts[1],
      bottom: parts[2],
      left: parts[3]
    });
  }

  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0
  };
}

/**
 * Create a label
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} maxWidth - Maximum width of the label
 * @param {number} maxHeight - Maximum height of the label
 * @param {string} color - Color of the shape
 * @param {number} fontSize - Font size of the text
 * @param {string} fontFamily - Font family of the text
 * @param {string} labelText - The text to be used for the label
 * @param {Renderer} renderer - A renderer such as SVG, DOM, Canvas or Mock with measureText
 * @param {string} align - Alignment property, 'left' or 'right'.
 * @param {object} renderingArea - The area in an object to be rendered in.
 * @param {number} padding - Padding around the corners of the label
 * @return {Container} - Returns container with objects as children
 */
export function labelItem({ x, y, maxWidth, maxHeight, color, fill, fontSize, fontFamily, labelText, renderer, align, renderingArea, padding, symbolPadding }) {
  maxWidth = typeof maxWidth === 'undefined' ? NaN : maxWidth;
  maxHeight = typeof maxHeight === 'undefined' ? NaN : maxHeight;
  align = typeof align === 'undefined' ? 'left' : align;
  fill = typeof fill === 'undefined' ? 'black' : fill;
  renderingArea = typeof renderingArea === 'undefined' ? { x: 0, y: 0, width: 0, height: 0 } : renderingArea;
  padding = resolvePadding(padding);
  symbolPadding = typeof symbolPadding === 'undefined' ? padding.right : symbolPadding;

  const labelMeasures = renderer.measureText({
    text: labelText,
    fontFamily,
    fontSize
  });

  const innerHeight = getMinimumViableNumber(maxHeight - padding.height, labelMeasures.height);

  const fontSizeDiff = parseFloat(fontSize) / labelMeasures.height;
  const fontSizeMod = innerHeight * fontSizeDiff;

  const wantedWidth = labelMeasures.width + innerHeight + padding.width + symbolPadding;
  const containerWidth = !isNaN(maxWidth) ? Math.min(maxWidth, wantedWidth) : wantedWidth;

  const container = {
    type: 'container',
    x: align === 'left' ? x : renderingArea.width - x - containerWidth,
    y,
    width: containerWidth,
    height: innerHeight + padding.height
  };

  const symbol = {
    type: 'rect',
    fill: color,
    x: align === 'left' ? container.x + padding.left : (container.x + container.width) - innerHeight - padding.right,
    y: container.y + padding.top,
    width: innerHeight,
    height: innerHeight
  };

  const label = {
    type: 'text',
    anchor: align === 'left' ? 'start' : 'end',
    x: align === 'left' ? symbol.x + symbol.width + symbolPadding : symbol.x - symbolPadding,
    y: symbol.y + innerHeight + (-1),
    maxWidth: container.width - symbol.width - (padding.width + symbolPadding),
    text: labelText,
    fill,
    fontSize: `${fontSizeMod}px`,
    fontFamily
  };

  container.children = [symbol, label];

  return container;
}
