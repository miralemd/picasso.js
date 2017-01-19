import { looseDistanceBasedGenerator, tightDistanceBasedGenerator } from '../../scales/linear';

function ticksByCount({ count, minorCount, scale, formatter }) {
  return scale
  .ticks(((count - 1) * minorCount) + count)
  .map((tick, i) => ({
    position: scale.get(tick),
    label: formatter(tick),
    isMinor: i % (minorCount + 1) !== 0
  }));
}

function ticksByValue({ values, scale, formatter }) {
  return values
    .filter(v => v <= scale.max() && v >= scale.min())
    .map(tick => ({
      position: scale.get(tick),
      label: formatter(tick),
      isMinor: false
    }));
}

function forceTicksAtBounds(ticks, scale, formatter) {
  // let bounds = [];
  const ticksP = ticks.map(t => t.position);
  const range = scale.range();

  if (ticksP.indexOf(range[0]) === -1) {
    ticks.splice(0, 0, {
      position: range[0],
      label: formatter(scale.start()),
      isMinor: false
    });
  }

  if (ticksP.indexOf(range[1]) === -1) {
    ticks.push({
      position: range[1],
      label: formatter(scale.end()),
      isMinor: false
    });
  }
}

export function generateContinuousTicks({ settings, scale, innerRect, formatter }) {
  let ticks;
  const minorCount = settings.minorTicks && settings.minorTicks.show ? settings.minorTicks.count : 0;

  if (settings.ticks.values) {
    // TODO With custom tick values, dont care if its within the domain?
    scale.tickGenerator(ticksByValue);
    ticks = scale.ticks({ values: settings.ticks.values, scale: scale.copy(), formatter });
  } else if (settings.ticks.count !== undefined) {
    scale.tickGenerator(ticksByCount);
    ticks = scale.ticks({ count: settings.ticks.count, minorCount, scale: scale.copy(), formatter });
  } else {
    const distance = settings.align === 'top' || settings.align === 'bottom' ? innerRect.width : innerRect.height;
    scale.tickGenerator(settings.ticks.tight ? tightDistanceBasedGenerator : looseDistanceBasedGenerator);
    ticks = scale.ticks({
      distance,
      minorCount,
      unitDivider: settings.ticks.distance,
      scale: scale.copy(),
      formatter
    });

    if (settings.ticks.tight) {
      scale.domain([ticks[0].label, ticks[ticks.length - 1].label]);
    }

    if (settings.ticks.forceBounds) {
      forceTicksAtBounds(ticks, scale, formatter);
    }
  }

  return ticks;
}

export function generateDiscreteTicks({ data, scale }) {
  return data.map((d, i) => {
    const p0 = scale.get(i);
    const p = p0 !== undefined ? p0 : scale.get(d);
    return {
      position: p,
      label: `${d}`
    };
  });
}
