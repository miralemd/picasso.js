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

function calcActualTextRect({ style, renderer, tick }) {
  return renderer.measureText({
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

function labelBuilder(ticks, buildOpts, renderer) {
  return ticks.map((tick) => {
    buildOpts.textRect = calcActualTextRect({ tick, renderer, style: buildOpts });
    return buildLabel(tick, buildOpts);
  });
}

function layeredLabelBuilder(ticks, buildOpts, settings, renderer) {
  const padding = buildOpts.padding;
  const padding2 = labelsSpacing(settings) + buildOpts.maxHeight + settings.labels.margin;
  return ticks.map((tick, i) => {
    buildOpts.padding = i % 2 === 0 ? padding : padding2;
    buildOpts.textRect = calcActualTextRect({ tick, renderer, style: buildOpts });
    return buildLabel(tick, buildOpts);
  });
}

function discreteCalcMaxTextRect({ renderer, settings, innerRect, scale }) {
  const h = renderer.measureText({
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
    const radians = settings.labels.tiltAngle * (Math.PI / 180);
    textRect.width = (innerRect.height - settings.paddingEnd) / Math.sin(radians);
  } else {
    textRect.width = scale.step() * 0.75 * innerRect.width;
  }
  return textRect;
}

function continuousCalcMaxTextRect({ renderer, settings, innerRect, ticks }) {
  const h = renderer.measureText({
    text: 'M',
    fontSize: settings.labels.fontSize,
    fontFamily: settings.labels.fontFamily
  }).height;

  const textRect = { width: 0, height: h };
  if (settings.align === 'left' || settings.align === 'right') {
    textRect.width = innerRect.width - labelsSpacing(settings) - settings.paddingEnd;
  } else {
    textRect.width = (innerRect.width / majorTicks(ticks).length) * 0.75;
  }
  return textRect;
}

export default function nodeBuilder(type) {
  let calcMaxTextRectFn;
  const nodes = [];

  function continuous() {
    calcMaxTextRectFn = continuousCalcMaxTextRect;
    return continuous;
  }

  function discrete() {
    calcMaxTextRectFn = discreteCalcMaxTextRect;
    return discrete;
  }

  function build({ settings, scale, innerRect, outerRect, renderer, ticks }) {
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
      const textRect = calcMaxTextRectFn({ renderer, settings, innerRect, ticks, scale });
      const padding = labelsSpacing(settings);
      buildOpts.style = settings.labels;
      buildOpts.padding = padding;
      buildOpts.maxWidth = textRect.width;
      buildOpts.maxHeight = textRect.height;
      buildOpts.layered = settings.labels.layered;
      buildOpts.tilted = !settings.labels.layered && settings.labels.tilted;
      buildOpts.angle = settings.labels.tiltAngle;

      if (settings.labels.layered && (settings.align === 'top' || settings.align === 'bottom')) {
        nodes.push(...layeredLabelBuilder(major, buildOpts, settings, renderer));
      } else {
        nodes.push(...labelBuilder(major, buildOpts, renderer));
      }
    }
    return nodes;
  }

  continuous.build = build;
  discrete.build = build;

  return type === 'ordinal' ? discrete() : continuous();
}
