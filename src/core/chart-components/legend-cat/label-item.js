import extend from 'extend';
import symbolFactory from '../../symbols';

function getWiggle(coord, innerSize, outerSize, m = 0) {
  let wiggle = 0;
  wiggle = outerSize - innerSize;
  wiggle *= Math.min(1, Math.max(m, 0));

  return wiggle;
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

export function labelItem({
  x,
  y,
  fixedInnerWidth,
  fixedInnerHeight,
  color,
  label,
  labelBounds,
  labelMeasure,
  anchor = 'left',
  renderingArea = { x: 0, y: 0, width: 0, height: 0 },
  margin,
  symbolPadding = 0,
  shape,
  shapeSize = 0,
  maxShapeSize = shapeSize,
  data,
  justify = 0,
  align = 0
}) {
  margin = resolveMargin(margin);
  const isAnchorLeft = anchor === 'left';
  // Fallback, usersettings, base-definition
  const labelDef = extend({}, label,
    { // This should not contain any properties that may alter the size of the label node, ex. maxWidth
      type: 'text',
      data,
      collider: { type: null }
    });

  const innerWidth = fixedInnerWidth || labelBounds.width + shapeSize + symbolPadding;
  const innerHeight = fixedInnerHeight || Math.max(labelBounds.height, shapeSize);
  const outerWidth = innerWidth + margin.left + margin.right;
  const outerHeight = innerHeight + margin.top + margin.bottom;

  const container = {
    type: 'container',
    x: isAnchorLeft ? x : (renderingArea.width - x - outerWidth),
    y,
    width: outerWidth,
    height: outerHeight,
    innerWidth,
    innerHeight,
    data,
    children: []
  };

  container.collider = {
    type: 'rect',
    x: container.x,
    y: container.y,
    width: container.width,
    height: container.height
  };

  if (shape) {
    const r = shapeSize / 2;
    let symX = isAnchorLeft ? container.x + margin.left + r : (container.x + outerWidth) - margin.right - r;
    let symY = container.y + r + margin.top;
    const wiggleX = getWiggle(symX, shapeSize, maxShapeSize, isAnchorLeft ? align : 1 - align);
    symX += isAnchorLeft ? wiggleX : -wiggleX;
    symY += getWiggle(symY, shapeSize, innerHeight, justify);

    let def;
    if (typeof shape !== 'object') {
      def = { type: shape };
    } else {
      def = shape;
    }

    const symDef = extend(
      { // Default props
        size: shapeSize,
        fill: color,
        stroke: color
      },
      def, // User defined
      { // Base props, not overridable
        x: symX,
        y: symY,
        data,
        collider: { type: null }
      }
    );
    const symbol = symbolFactory(symDef);
    container.children.push(symbol);
  }

  labelDef.x = isAnchorLeft ? container.x + margin.left + maxShapeSize + symbolPadding : (container.x + outerWidth) - margin.right - maxShapeSize - symbolPadding;
  labelDef.y = container.y + margin.top + labelMeasure.height;
  labelDef.y += getWiggle(labelDef.y, labelBounds.height, innerHeight, justify);

  container.children.push(labelDef);

  return container;
}
