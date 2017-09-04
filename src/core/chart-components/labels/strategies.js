import extend from 'extend';
import collisions from '../../math/narrow-phase-collision';

const LINE_HEIGHT = 1.4;
const PADDING = 4;
const DOUBLE_PADDING = PADDING * 2;

export function placeTextInRect(rect, text, opts) {
  const label = {
    type: 'text',
    text,
    maxWidth: rect.width,
    x: 0,
    y: rect.y,
    dx: 0,
    dy: 0,
    fill: opts.fill,
    anchor: 'start',
    baseline: 'alphabetical',
    fontSize: `${opts.fontSize}px`,
    fontFamily: opts.fontFamily
  };

  const textMetrics = opts.textMetrics;

  if (rect.width < opts.fontSize || rect.height < textMetrics.height * LINE_HEIGHT) {
    return false;
  }

  const wiggleWidth = Math.max(0, rect.width - textMetrics.width);
  const wiggleHeight = Math.max(0, rect.height - (textMetrics.height * LINE_HEIGHT));
  label.x = rect.x + (opts.align * wiggleWidth);
  label.y = rect.y + textMetrics.height + (opts.justify * wiggleHeight);

  if (opts.transform) {
    label.transform = `rotate(90, ${label.x + label.dx}, ${label.y + label.dy})`;
  }

  return label;
}

export function placeVerticalTextInRect(rect, text, opts) {
  const label = {
    type: 'text',
    text,
    maxWidth: rect.height,
    x: 0,
    y: rect.y,
    dx: 0,
    dy: 0,
    fill: opts.fill,
    anchor: 'end',
    baseline: 'alphabetical',
    fontSize: `${opts.fontSize}px`,
    fontFamily: opts.fontFamily
  };

  const textMetrics = opts.textMetrics;

  if (rect.width < opts.fontSize || rect.height < textMetrics.height * LINE_HEIGHT) {
    return false;
  }

  const wiggleHor = Math.max(0, rect.width - (textMetrics.height * LINE_HEIGHT));
  const wiggleVert = Math.max(0, rect.height - textMetrics.width);
  label.x = rect.x + textMetrics.height + (opts.align * wiggleHor);
  label.y = rect.y + (opts.justify * wiggleVert);

  label.transform = `rotate(-90, ${label.x + label.dx}, ${label.y + label.dy})`;

  return label;
}

function getBarRect({ bar, view, direction, position }) {
  const bounds = {};

  if (direction === 'up' || direction === 'down') {
    bounds.x = bar.x;
    bounds.width = bar.width;

    const start = Math.max(0, Math.min(bar.y, view.height));
    const end = Math.max(0, Math.min(bar.y + bar.height, view.height));

    if ((position === 'outside' && direction === 'up') || (position === 'opposite' && direction === 'down')) {
      bounds.y = PADDING;
      bounds.height = start - DOUBLE_PADDING;
    } else if ((position === 'outside' && direction === 'down') || (position === 'opposite' && direction === 'up')) {
      bounds.y = end + PADDING;
      bounds.height = Math.max(0, view.height - end - DOUBLE_PADDING);
    } else {
      bounds.height = end - start - DOUBLE_PADDING;
      bounds.y = start + PADDING;
    }
  }

  return bounds;
}

function placeInVerticalBars({
  nodes,
  stngs,
  placementSettings,
  labelSettings,
  measurements,
  texts,
  rect,
  fitsHorizontally
}) {
  const labels = [];
  const textPlacementFn = fitsHorizontally ? placeTextInRect : placeVerticalTextInRect;
  let label;
  let node;
  let d;
  let text;
  let justify;
  let bounds;
  let fill;
  let testBounds;
  let measured;
  let direction;
  let lblStngs;
  let nodeTexts;
  let placement;
  let placements;
  let p;

  for (let i = 0, len = nodes.length; i < len; i++) {
    bounds = null;
    node = nodes[i];
    d = node.data;
    nodeTexts = texts[i];
    direction = typeof stngs.direction === 'function' ? stngs.direction(d) : stngs.direction || 'up';
    for (let j = 0; j < nodeTexts.length; j++) {
      text = nodeTexts[j];
      if (!text) {
        continue; // eslint-ignore-line
      }

      lblStngs = labelSettings[j];
      measured = measurements[i][j];
      placements = lblStngs.placements;

      let largest;
      const boundaries = [];

      for (p = 0; p < placements.length; p++) {
        placement = placementSettings[j][p];
        testBounds = getBarRect({
          bar: node.localBounds,
          view: rect,
          direction,
          position: placement.position
        });
        boundaries.push(testBounds);
        largest = !p || testBounds.height > largest.height ? testBounds : largest;
        if ((fitsHorizontally && testBounds.height > measured.height * LINE_HEIGHT) ||
          (!fitsHorizontally && testBounds.height > measured.width)) {
          bounds = testBounds;
          break;
        }
      }

      // fallback strategy - place the text in the largest rectangle
      if (!fitsHorizontally && !bounds && largest.height > lblStngs.fontSize * 2) {
        bounds = largest;
        p = boundaries.indexOf(bounds);
      }
      placement = placementSettings[j][p];

      if (bounds && placement) {
        justify = placement.justify;
        if (typeof placement.fill === 'function') {
          fill = placement.fill({ node, data: d }, i);
        } else {
          fill = placement.fill;
        }

        if (direction === 'up') {
          justify = 1 - justify;
        }
        if (placement.position === 'opposite') {
          justify = 1 - justify;
        }

        label = textPlacementFn(bounds, text, {
          fill,
          justify,
          align: placement.align,
          fontSize: lblStngs.fontSize,
          fontFamily: lblStngs.fontFamily,
          textMetrics: measured
        });

        if (label) {
          labels.push(label);
        }
      }
    }
  }

  return labels;
}

/**
 * @typedef settings
 * @type {object}
 * @property {string|function} [direction='up'] - The direction in which the bars are growing: 'up', or 'down'
 * @property {string} [fontFamily='Arial']
 * @property {number} [fontSize=12]
 * @property {object} labels
 * @property {string|function} labels.label - The text value
 * @property {object} labels.placements
 * @property {string} labels.placements.position,
 * @property {number} [labels.placements.justify=0] - Placement of the label along the direction of the bar
 * @property {number} [labels.placements.align=0.5] - Placement of the label along the perpendicular direction of the bar
 * @property {string} [labels.placements.fill='#333'] - Color of the label
 */

export function bars({
  settings,
  nodes,
  data,
  rect,
  renderer
}) {
  const defaults = {
    fontSize: 12,
    fontFamily: 'Arial',
    align: 0.5,
    justify: 0,
    fill: '#333'
  };
  const measurements = [];
  const texts = [];
  const labelStruct = {};
  let fitsHorizontally = true;
  let node;
  let d;
  let text;
  let bounds;
  let measured;
  let lblStng;

  const labelSettings = settings.labels.map(labelSetting =>
    extend({}, defaults, settings, labelSetting)
  );

  const placementSettings = settings.labels.map(labelSetting =>
    labelSetting.placements.map(placement =>
      extend({}, defaults, settings, labelSetting, placement)
    )
  );

  // step one - measure if all labels fit horizontally
  for (let i = 0, len = nodes.length; i < len; i++) {
    texts[i] = [];
    measurements[i] = [];
    node = nodes[i];
    bounds = node.localBounds;
    if (!collisions.testRectRect(bounds, rect)) {
      continue;
    }
    d = node.data;
    for (let j = 0; j < labelSettings.length; j++) {
      lblStng = labelSettings[j];
      text = typeof lblStng.label === 'function' ? lblStng.label(d) : '';
      if (!text) {
        continue; // eslint-ignore-line
      }

      labelStruct.fontFamily = lblStng.fontFamily;
      labelStruct.fontSize = `${lblStng.fontSize}px`;
      labelStruct.text = text;

      measured = renderer.measureText(labelStruct);
      measurements[i][j] = measured;
      texts[i][j] = text;
      fitsHorizontally = fitsHorizontally && measured.width <= bounds.width;
    }
  }

  return placeInVerticalBars({
    nodes,
    texts,
    measurements,
    stngs: settings,
    placementSettings,
    labelSettings,
    data,
    rect,
    fitsHorizontally
  });
}
