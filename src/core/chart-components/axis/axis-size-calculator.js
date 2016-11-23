
function isMajorTick(tick) {
  return !tick.isMinor;
}

export function calcRequiredSize({ data, formatter, renderer, scale, settings, ticksFn }) {
  return function (rect) {
    let size = 0;

    if (settings.labels.show) {
      const dock = settings.dock;
      const horizontal = dock === 'top' || dock === 'bottom';

      const measureText = text => renderer.measureText({
        text,
        fontSize: settings.labels.fontSize,
        fontFamily: settings.labels.fontFamily
      });
      let sizeFromTextRect;
      if (settings.labels.tilted) {
        const radians = Math.PI / 3; // angle in radians
        sizeFromTextRect = r => (r.height * Math.sin(radians)) + (r.width * Math.cos(radians));
      } else if (horizontal) {
        sizeFromTextRect = r => r.height;
      } else {
        sizeFromTextRect = r => r.width;
      }

      let labels;
      if (horizontal && !settings.labels.tilted) {
        labels = ['M'];
      } else {
        labels = ticksFn({ settings, innerRect: rect, scale, data, formatter })
          .filter(isMajorTick)
          .map(tick => tick.label);
      }
      const labelSizes = labels.map(measureText).map(sizeFromTextRect);
      const textSize = Math.max(...labelSizes);

      size += textSize;
      size += settings.labels.padding;

      const layered = horizontal && settings.labels.layered;
      if (layered) {
        size *= 2;
      }
    }
    if (settings.ticks.show) {
      size += settings.ticks.padding;
      size += settings.ticks.tickSize;
    }
    if (settings.minorTicks && settings.minorTicks.show) {
      const minorTicksSize = settings.minorTicks.padding + settings.minorTicks.tickSize;
      if (minorTicksSize > size) {
        size = minorTicksSize;
      }
    }
    if (settings.line.show) {
      size += settings.line.strokeWidth;
    }
    size += 10; // 10px outside margin

    return size;
  };
}