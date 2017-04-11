import extend from 'extend';
import {
  rectCollidesWithRect,
  isLineSegmentIntersectingRect,
  getLineVectors,
  getRectVertices } from '../../math/intersection';

export function refLabelDefaultSettings() {
  return {
    fill: '#000',
    fontFamily: 'Arial',
    fontSize: '12px',
    opacity: 1,
    background: {
      fill: '#fff',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 0.5
    }
  };
}

/**
 * Converts a numerical OR string value to a normalized value
 *
 * @param {string|number} align -Description how to align (Numerical from 0-1 or 'top', 'left', 'center', 'middle', 'bottom' or 'right')
 * @returns {number} - Normalized value 0...1
 * @ignore
 */
export function alignmentToNumber(align) {
  if (typeof align === 'undefined') {
    return 0;
  } else if (typeof align === 'number' && isFinite(align)) {
    return align;
  } else if (typeof align === 'string') {
    switch (align) {
      case 'center':
      case 'middle':
        return 0.5;
      case 'bottom':
      case 'right':
        return 1;
      case 'top':
      case 'left':
      default:
        return 0;
    }
  }

  return 0;
}

/**
 * Create line and label (if applicable)
 * Does not return anything, modifies "items" property instead (should be re-considered)
 *
 * @param {object} p - Current point
 * @param {object} style - Applicable line styling
 * @param {object} settings - Settings object derived from parent
 * @param {object[]} items - Array of all items (for collision detection)
 * @ignore
 */
export function createLineWithLabel({ blueprint, renderer, p, settings, items }) {
  let doesNotCollide = true;
  let line = false;
  let rect = false;
  let label = false;
  let style = extend({}, settings.style.line, p.style || {});

  // Use the transposer to handle actual positioning
  line = blueprint.processItem({
    type: 'line',
    x1: p.position,
    y1: 0,
    x2: p.position,
    y2: 1,
    stroke: style.stroke || 'black',
    strokeWidth: style.strokeWidth || 1,
    flipXY: p.flipXY || false // This flips individual points (Y-lines)
  });

  if (p.label) {
    const item = extend({}, refLabelDefaultSettings(), settings.style.label || {}, { fill: style.stroke }, p.label);

    // We start by measuring the text
    let measured = renderer.measureText({
      text: item.text || '',
      fontFamily: item.fontFamily,
      fontSize: item.fontSize
    });

    let labelPadding = p.label.padding || 5;

    let anchor = item.anchor === 'end' ? 'end' : 'start';

    let align = alignmentToNumber(p.flipXY ? p.label.vAlign : p.label.align);
    let vAlign = alignmentToNumber(p.flipXY ? p.label.align : p.label.vAlign);

    let rectWidth = (p.flipXY ? measured.height : measured.width) + (labelPadding * 2);
    let rectHeight = (p.flipXY ? measured.width : measured.height) + (labelPadding * 2);

    rect = blueprint.processItem({
      fn: ({ width, height }) => ({
        type: 'rect',
        x: (p.position * width) + -(((p.flipXY ? measured.height : measured.width) + (labelPadding * 2)) * (1 - align)),
        y: Math.abs((vAlign * height) - (rectHeight * vAlign)),
        width: rectWidth,
        height: rectHeight,
        stroke: item.background.stroke,
        strokeWidth: item.background.strokeWidth,
        fill: item.background.fill,
        opacity: item.background.opacity
      }),
      flipXY: p.flipXY || false // This flips individual points (Y-lines)
    });

    if (
      rect.x < -1 || (rect.x + rect.width) > (blueprint.width + 1) ||
      rect.y < -1 || (rect.y + rect.height) > (blueprint.height + 1)
    ) {
      // do not create labels if out of bounds
      rect = undefined;
    } else {
      // Labels are just basic objects attached to a corner of a rect,
      // and this rect needs to already be processed
      // so there is no blueprint.processItem required here
      label = {
        type: 'text',
        text: item.text || '',
        fill: item.fill,
        opacity: item.opacity,
        fontFamily: item.fontFamily,
        fontSize: item.fontSize,
        x: rect.x + labelPadding + (anchor === 'end' ? measured.width : 0),
        y: rect.y + (rect.height / 2) + (measured.height / 3),
        anchor
      };

      // Detect collisions with other labels/rects or lines
      for (let i = 0, len = items.length; i < len; i++) {
        let curItem = items[i];

        if (curItem.type === 'rect') {
          // We only detect rects here, since rects are always behind labels,
          // and we wouldn't want to measure text one more time
          if (rectCollidesWithRect(rect, curItem)) {
            doesNotCollide = false;
          }
        } else if (curItem.type === 'line') {
          // This will only collide when flipXY are the same for both objects,
          // So it only collides on objects on the same "axis"
          if (p.flipXY === curItem.flipXY && isLineSegmentIntersectingRect(getLineVectors(curItem), getRectVertices(rect))) {
            doesNotCollide = false;
          }
        }
      }
    }
  }

  // Always push the line,
  // but this is done after collision detection,
  // because otherwise it would collide with it's own line
  items.push(line);

  // Only push rect & label if we haven't collided and both are defined
  if (doesNotCollide && rect && label) {
    items.push(rect, label);
  }
}
