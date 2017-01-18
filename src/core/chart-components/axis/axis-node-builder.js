import { buildLabel, buildTick, buildLine } from './axis-structs';

function tickSpacing(settings) {
  let spacing = 0;
  spacing += settings.paddingStart;
  spacing += settings.line.show ? settings.line.strokeWidth : 0;
  spacing += settings.ticks.show ? settings.ticks.margin : 0;
  return spacing;
}

function tickMinorSpacing(settings) {
  return settings.line.strokeWidth + settings.minorTicks.margin;
}

function labelsSpacing(settings) {
  let spacing = 0;
  spacing += settings.ticks.show ? settings.ticks.tickSize : 0;
  spacing += tickSpacing(settings) + settings.labels.margin;
  return spacing;
}

function calcActualTextRect({ style, measureText, tick }) {
  return measureText({
    text: tick.label,
    fontSize: style.fontSize,
    fontFamily: style.fontFamily
  });
}

function majorTicks(ticks) {
  return ticks.filter(t => !t.isMinor);
}

function minorTicks(ticks) {
  return ticks.filter(t => t.isMinor);
}

function tickBuilder(ticks, buildOpts) {
  return ticks.map(tick =>
   buildTick(tick, buildOpts)
);
}

function labelBuilder(ticks, buildOpts, measureText) {
  return ticks.map((tick, i) => {
    buildOpts.textRect = calcActualTextRect({ tick, measureText, style: buildOpts });
    const label = buildLabel(tick, buildOpts);
    label.data = i;
    return label;
  });
}

function layeredLabelBuilder(ticks, buildOpts, settings, measureText) {
  const padding = buildOpts.padding;
  const padding2 = labelsSpacing(settings) + buildOpts.maxHeight + settings.labels.margin;
  return ticks.map((tick, i) => {
    buildOpts.layer = i % 2;
    buildOpts.padding = i % 2 === 0 ? padding : padding2;
    buildOpts.textRect = calcActualTextRect({ tick, measureText, style: buildOpts });
    const label = buildLabel(tick, buildOpts);
    label.data = i;
    return label;
  });
}

function discreteCalcMaxTextRect({ measureText, settings, innerRect, scale }) {
  const h = measureText({
    text: 'M',
    fontSize: settings.labels.fontSize,
    fontFamily: settings.labels.fontFamily
  }).height;

  const textRect = { width: 0, height: h };
  if (settings.align === 'left' || settings.align === 'right') {
    textRect.width = innerRect.width - labelsSpacing(settings) - settings.paddingEnd;
  } else if (settings.labels.layered) {
    textRect.width = (scale.step() * 0.75 * innerRect.width) * 2;
  } else if (!settings.labels.layered && settings.labels.tilted) {
    const radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180);
    textRect.width = (innerRect.height - labelsSpacing(settings) - settings.paddingEnd - (h * Math.cos(radians))) / Math.sin(radians);
  } else {
    textRect.width = scale.step() * 0.75 * innerRect.width;
  }
  return textRect;
}

function continuousCalcMaxTextRect({ measureText, settings, innerRect, ticks }) {
  const h = measureText({
    text: 'M',
    fontSize: settings.labels.fontSize,
    fontFamily: settings.labels.fontFamily
  }).height;

  const textRect = { width: 0, height: h };
  if (settings.align === 'left' || settings.align === 'right') {
    textRect.width = innerRect.width - labelsSpacing(settings) - settings.paddingEnd;
  } else if (settings.labels.layered) {
    textRect.width = (innerRect.width / majorTicks(ticks).length) * 0.75 * 2;
  } else if (!settings.labels.layered && settings.labels.tilted) {
    const radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180);
    textRect.width = (innerRect.height - labelsSpacing(settings) - settings.paddingEnd - (h * Math.cos(radians))) / Math.sin(radians);
  } else {
    textRect.width = (innerRect.width / majorTicks(ticks).length) * 0.75;
  }
  return textRect;
}

export default function nodeBuilder(type) {
  let calcMaxTextRectFn;
  let getStepSizeFn;

  function continuous() {
    calcMaxTextRectFn = continuousCalcMaxTextRect;
    getStepSizeFn = () => null;
    return continuous;
  }

  function discrete() {
    calcMaxTextRectFn = discreteCalcMaxTextRect;
    getStepSizeFn = ({ innerRect, scale, settings }) => {
      const size = settings.align === 'top' || settings.align === 'bottom' ? innerRect.width : innerRect.height;
      return size * scale.step();
    };
    return discrete;
  }

  function build({ settings, scale, innerRect, outerRect, measureText, ticks }) {
    const nodes = [];
    const major = majorTicks(ticks);
    const minor = minorTicks(ticks);
    const buildOpts = {
      innerRect,
      align: settings.align,
      outerRect
    };

    if (settings.line.show) {
      buildOpts.style = settings.line;
      buildOpts.padding = settings.paddingStart;

      nodes.push(buildLine(buildOpts));
    }
    if (settings.ticks.show) {
      buildOpts.style = settings.ticks;
      buildOpts.tickSize = settings.ticks.tickSize;
      buildOpts.padding = tickSpacing(settings);

      nodes.push(...tickBuilder(major, buildOpts));
    }
    if (settings.minorTicks && settings.minorTicks.show) {
      buildOpts.style = settings.minorTicks;
      buildOpts.tickSize = settings.minorTicks.tickSize;
      buildOpts.padding = tickMinorSpacing(settings);

      nodes.push(...tickBuilder(minor, buildOpts));
    }
    if (settings.labels.show) {
      const textRect = calcMaxTextRectFn({ measureText, settings, innerRect, ticks, scale });
      const padding = labelsSpacing(settings);
      buildOpts.stepSize = getStepSizeFn({ innerRect, scale, ticks, settings });
      buildOpts.style = settings.labels;
      buildOpts.padding = padding;
      buildOpts.maxWidth = textRect.width;
      buildOpts.maxHeight = textRect.height;
      buildOpts.layered = settings.labels.layered;
      buildOpts.tilted = !settings.labels.layered && settings.labels.tilted && (settings.align === 'top' || settings.align === 'bottom');
      buildOpts.angle = settings.labels.tiltAngle;

      if (settings.labels.layered && (settings.align === 'top' || settings.align === 'bottom')) {
        nodes.push(...layeredLabelBuilder(major, buildOpts, settings, measureText));
      } else {
        nodes.push(...labelBuilder(major, buildOpts, measureText));
      }
    }
    return nodes;
  }

  continuous.build = build;
  discrete.build = build;

  return type === 'ordinal' ? discrete() : continuous();
}
