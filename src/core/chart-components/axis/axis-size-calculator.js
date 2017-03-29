import { scaleWithSize } from '../../scales';

function isMajorTick(tick) {
  return !tick.isMinor;
}

function verticalLabelOverlap({
  majorTicks,
  measureText,
  rect
}) {
  const size = rect.height;
  const textHeight = measureText('M').height;
  for (let i = 1; i < majorTicks.length; ++i) {
    const d = size * Math.abs(majorTicks[i - 1].position - majorTicks[i].position);
    if (d < textHeight) {
      return true;
    }
  }
  return false;
}

function horizontalLabelOverlap({
  majorTicks,
  measureText,
  rect,
  scale,
  state
}) {
  /**
   * Currently isn't any good way of doing a accurate measurement on size available (bandWidth * width) for labels.
   * It's a lifecycle limitation as components docked either left or right can affect the width available after the calculation is done.
   * <number of components docked left/right> * <width of components> => Less accurate ===> Can result in only ellips char rendered as labels.
   */
  const m = state.labels.activeMode === 'layered' ? 2 : 1;
  const size = rect.width;
  const tickSize = majorTicks
    .map(tick => tick.label)
    .map(l => `${l.slice(0, 1)}${l.length > 1 ? '…' : ''}`) // Measure the size of 1 chars + the ellips char.
    .map(measureText)
    .map(r => r.width);
  for (let i = 0; i < majorTicks.length; ++i) {
    const d1 = m * size * scale.bandwidth();
    const d2 = tickSize[i];
    if (d1 < d2) {
      return true;
    }
  }
  return false;
}

function autoTilt({
  majorTicks,
  measure,
  rect,
  scale,
  state,
  settings
}) {
  const glyphCount = settings.labels.maxGlyphCount;
  const m = state.labels.activeMode === 'layered' ? 2 : 1;
  const magicSizeRatioMultipler = 0.7; // So that if less the 70% of labels are visible, toggle on tilt
  const ellipsCharSize = measure('…').width; // include ellipsed char in calc as it's generally large then the char it replaces
  const size = rect.width;
  const d1 = m * size * scale.bandwidth();
  let maxLabelWidth = 0;

  if (!isNaN(glyphCount)) {
    maxLabelWidth = measure('M').width * magicSizeRatioMultipler * glyphCount;
    if (maxLabelWidth + ellipsCharSize > d1) {
      return true;
    }
  } else {
    for (let i = 0; i < majorTicks.length; i++) {
      const label = majorTicks[i].label;
      const width = measure(label).width * (label.length > 1 ? magicSizeRatioMultipler : 1);
      if (width + ellipsCharSize > d1) {
        return true;
      }
    }
  }

  return false;
}

function tiltedLabelOverlap({
  majorTicks,
  measureText,
  rect,
  bleedSize,
  angle
}) {
  if (majorTicks.length < 2) {
    return false;
  } else if (angle === 0) {
    return true; // TODO 0 angle should be considered non-tilted
  }
  const absAngle = Math.abs(angle);
  const size = rect.width - bleedSize;
  const stepSize = size * Math.abs(majorTicks[0].position - majorTicks[1].position);
  const textHeight = measureText('M').height;
  const reciprocal = 1 / stepSize; // 1 === Math.sin(90 * (Math.PI / 180))
  const distanceBetweenLabels = Math.sin(absAngle * (Math.PI / 180)) / reciprocal;

  return textHeight > distanceBetweenLabels;
}

function isToLarge({
  rect,
  scale,
  state,
  majorTicks,
  measure,
  horizontal
}) {
  const horizontalOverlap =
    horizontal &&
    horizontalLabelOverlap({
      majorTicks,
      measureText: measure,
      rect,
      scale,
      state
    });
  const verticalOverlap =
    !horizontal &&
    verticalLabelOverlap({
      majorTicks,
      measureText: measure,
      rect,
      state
    });

  return horizontalOverlap || verticalOverlap;
}

export default function calcRequiredSize({
  isDiscrete,
  rect,
  data,
  formatter,
  measureText,
  scale,
  settings,
  state
}) {
  let size = 0;
  const edgeBleed = { left: 0, top: 0, right: 0, bottom: 0 };

  if (settings.labels.show) {
    const align = settings.align;
    const horizontal = align === 'top' || align === 'bottom';
    const distance = horizontal ? rect.width : rect.height;
    scale = scaleWithSize(scale, distance);
    const majorTicks = scale.ticks({
      settings,
      distance,
      data,
      formatter
    })
    .filter(isMajorTick);

    const measure = (text) => {
      const m = measureText({
        text,
        fontSize: settings.labels.fontSize,
        fontFamily: settings.labels.fontFamily
      });
      if (settings.labels.maxWidth) {
        m.width = Math.min(m.width, settings.labels.maxWidth);
      }
      return m;
    };

    if (isDiscrete && horizontal && settings.labels.mode === 'auto' && autoTilt({ majorTicks, measure, rect, scale, state, settings })) {
      state.labels.activeMode = 'tilted';
    } else if (isDiscrete && state.labels.activeMode !== 'tilted' && isToLarge({ rect, scale, state, majorTicks, measure, horizontal })) {
      const toLargeSize = Math.max(rect.width, rect.height); // used to hide the axis
      return { size: toLargeSize };
    }

    let sizeFromTextRect;
    if (state.labels.activeMode === 'tilted') {
      const radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180); // angle in radians
      sizeFromTextRect = r => (r.width * Math.sin(radians)) + (r.height * Math.cos(radians));
    } else if (horizontal) {
      sizeFromTextRect = r => r.height;
    } else {
      sizeFromTextRect = r => r.width;
    }

    let labels;
    if (horizontal && state.labels.activeMode !== 'tilted') {
      labels = ['M'];
    } else if (!isNaN(settings.labels.maxGlyphCount)) {
      labels = [Array(settings.labels.maxGlyphCount).fill('M').join('')];
    } else {
      labels = majorTicks.map(tick => tick.label);
    }
    const tickMeasures = labels.map(measure);
    const labelSizes = tickMeasures.map(sizeFromTextRect);
    const textSize = Math.min(settings.labels.maxSize, Math.max(...labelSizes));
    size += textSize;
    size += settings.labels.margin;

    if (state.labels.activeMode === 'layered') {
      size *= 2;
    }

    if (state.labels.activeMode === 'tilted') {
      const extendLeft = (settings.align === 'bottom') === (settings.labels.tiltAngle >= 0);
      const radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180); // angle in radians
      const h = measureText('M').height;
      const maxWidth = (textSize - (h * Math.cos(radians))) / Math.sin(radians);
      const labelWidth = r => (Math.min(maxWidth, r.width) * Math.cos(radians)) + r.height;
      const adjustByPosition = (s, i) => {
        if (extendLeft) {
          return s - (majorTicks[i].position * rect.width);
        }
        return s - ((1 - majorTicks[i].position) * rect.width);
      };
      const bleedSize = Math.min(settings.labels.maxEdgeBleed, Math.max(...tickMeasures.map(labelWidth).map(adjustByPosition))) + settings.paddingEnd;
      const bleedDir = extendLeft ? 'left' : 'right';
      edgeBleed[bleedDir] = bleedSize;

      if (isDiscrete && tiltedLabelOverlap({ majorTicks, measureText, rect, bleedSize, angle: settings.labels.tiltAngle })) {
        return { size: Math.max(rect.width, rect.height) };
      }
    }
  }
  if (settings.ticks.show) {
    size += settings.ticks.margin;
    size += settings.ticks.tickSize;
  }
  if (settings.minorTicks && settings.minorTicks.show) {
    const minorTicksSize = settings.minorTicks.margin + settings.minorTicks.tickSize;
    if (minorTicksSize > size) {
      size = minorTicksSize;
    }
  }
  if (settings.line.show) {
    size += settings.line.strokeWidth;
  }
  size += settings.paddingStart;
  size += settings.paddingEnd;

  return { size, edgeBleed };
}
