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
  settings
}) {
  /**
   * Currently isn't any good way of doing a accurate measurement on size available (bandWidth * width) for labels.
   * It's a lifecycle limitation as components docked either left or right can affect the width available after the calculation is done.
   * <number of components docked left/right> * <width of components> => Less accurate ===> Can result in only ellips char rendered as labels.
   */
  const m = settings.labels.layered ? 2 : 1;
  const size = rect.width;
  const tickSize = majorTicks
    .map(tick => tick.label)
    .map(l => `${l.slice(0, 1)}…`) // Measure the size of 1 chars + the ellips char.
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

function tiltedLabelOverlap({
  majorTicks,
  measureText,
  rect
}) {
  const size = rect.width;
  const textHeight = measureText('M').height;
  for (let i = 1; i < majorTicks.length; ++i) {
    const d = size * Math.abs(majorTicks[i - 1].position - majorTicks[i].position);
    if (d < textHeight) {
      return true;
    }
  }
  return false;
}

function isToLarge({
  rect,
  scale,
  settings,
  tilted,
  majorTicks,
  measure,
  horizontal
}) {
  const tiltedOverlap = tilted && tiltedLabelOverlap({
    majorTicks,
    measureText: measure,
    rect
  });
  const horizontalOverlap =
    !tilted &&
    horizontal &&
    horizontalLabelOverlap({
      majorTicks,
      measureText: measure,
      rect,
      scale,
      settings
    });
  const verticalOverlap =
    !horizontal &&
    verticalLabelOverlap({
      majorTicks,
      measureText: measure,
      rect,
      settings
    });

  return tiltedOverlap || horizontalOverlap || verticalOverlap;
}

export default function calcRequiredSize({
  isDiscrete,
  rect,
  data,
  formatter,
  measureText,
  scale,
  settings
}) {
  let size = 0;
  const edgeBleed = { left: 0, top: 0, right: 0, bottom: 0 };

  if (settings.labels.show) {
    const align = settings.align;
    const horizontal = align === 'top' || align === 'bottom';
    const layered = horizontal && settings.labels.layered;

    const distance = horizontal ? rect.width : rect.height;

    const tilted = horizontal && settings.labels.tilted && !layered;
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

    let sizeFromTextRect;
    if (tilted) {
      const radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180); // angle in radians
      sizeFromTextRect = r => (r.width * Math.sin(radians)) + (r.height * Math.cos(radians));
    } else if (horizontal) {
      sizeFromTextRect = r => r.height;
    } else {
      sizeFromTextRect = r => r.width;
    }

    if (isDiscrete && isToLarge({ rect, scale, settings, tilted, majorTicks, measure, horizontal })) {
      const toLargeSize = Math.max(rect.width, rect.height); // used to hide the axis
      return { size: toLargeSize };
    }

    let labels;
    if (horizontal && !tilted) {
      labels = ['M'];
    } else {
      labels = majorTicks.map(tick => tick.label);
    }
    const tickMeasures = labels.map(measure);
    const labelSizes = tickMeasures.map(sizeFromTextRect);
    const textSize = Math.min(settings.labels.maxSize, Math.max(...labelSizes));
    size += textSize;
    size += settings.labels.margin;
    if (layered) {
      size *= 2;
    }
    if (tilted) {
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
