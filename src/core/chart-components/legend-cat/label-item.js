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
 * Resolve margin object, number or string
 *
 * @param  {number|object|string} margin - Multiple formats
 * @return {object} - Returns margin object with correct top, right, bottom, left and width/height
 */
export function resolveMargin(margin) {
  if (typeof margin === 'object' && margin !== null) {
    const output = {};
    output.top = parseFloat(margin.top || 0);
    output.right = parseFloat((typeof margin.right === 'undefined' || isNaN(margin.right) ? output.top : margin.right) || 0);
    output.bottom = parseFloat((typeof margin.bottom === 'undefined' || isNaN(margin.bottom) ? output.top : margin.bottom) || 0);
    output.left = parseFloat((typeof margin.left === 'undefined' || isNaN(margin.left) ? output.right : margin.left) || 0);

    output.width = output.left + output.right;
    output.height = output.top + output.bottom;

    return output;
  } else if (typeof margin === 'number') {
    return {
      top: margin,
      right: margin,
      bottom: margin,
      left: margin,
      width: margin * 2,
      height: margin * 2
    };
  } else if (typeof margin === 'string') {
    const parts = margin.replace(/px/gi, '').split(' ');

    return resolveMargin({
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
 * @param {number} margin - Margin around the corners of the label
 * @return {Container} - Returns container with objects as children
 */
export function labelItem({ x, y, maxWidth, maxHeight, color, fill, fontSize, fontFamily, labelText, renderer, align, renderingArea, margin, symbolPadding, data }) {
  maxWidth = typeof maxWidth === 'undefined' ? NaN : maxWidth;
  maxHeight = typeof maxHeight === 'undefined' ? NaN : maxHeight;
  align = typeof align === 'undefined' ? 'left' : align;
  fill = typeof fill === 'undefined' ? 'black' : fill;
  renderingArea = typeof renderingArea === 'undefined' ? { x: 0, y: 0, width: 0, height: 0 } : renderingArea;
  margin = resolveMargin(margin);
  symbolPadding = typeof symbolPadding === 'undefined' ? margin.right : symbolPadding;
  const dataIndex = data && data.index;

  const labelMeasures = renderer.measureText({
    text: labelText,
    fontFamily,
    fontSize
  });

  const innerHeight = getMinimumViableNumber(maxHeight - margin.height, labelMeasures.height);

  const fontSizeDiff = parseFloat(fontSize) / labelMeasures.height;
  const fontSizeMod = innerHeight * fontSizeDiff;

  const wantedWidth = labelMeasures.width + innerHeight + margin.width + symbolPadding;

  if (renderingArea.width > 0) {
    if (isNaN(maxWidth)) {
      maxWidth = renderingArea.width - x;
    } else {
      maxWidth = Math.min(maxWidth, renderingArea.width - x);
    }
  }

  const containerWidth = !isNaN(maxWidth) ? Math.min(maxWidth, wantedWidth) : wantedWidth;

  const container = {
    type: 'container',
    x: align === 'left' ? x : renderingArea.width - x - containerWidth,
    y,
    width: containerWidth,
    height: innerHeight + margin.height,
    dataIndex,
    data
  };

  container.collider = {
    type: 'rect',
    x: align === 'left' ? x : renderingArea.width - x - containerWidth,
    y,
    width: containerWidth,
    height: innerHeight + margin.height
  };

  const symbol = {
    type: 'rect',
    fill: color,
    x: align === 'left' ? container.x + margin.left : (container.x + container.width) - innerHeight - margin.right,
    y: container.y + margin.top,
    width: innerHeight,
    height: innerHeight,
    dataIndex
  };

  const label = {
    type: 'text',
    anchor: align === 'left' ? 'start' : 'end',
    x: align === 'left' ? symbol.x + symbol.width + symbolPadding : symbol.x - symbolPadding,
    y: symbol.y + innerHeight + (-1),
    maxWidth: (container.width - symbol.width - (margin.width + symbolPadding)) + 1,
    text: labelText,
    fill,
    fontSize: `${fontSizeMod}px`,
    fontFamily,
    dataIndex
  };

  container.children = [symbol, label];

  return container;
}
