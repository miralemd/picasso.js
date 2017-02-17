import { looseDistanceBasedGenerator, tightDistanceBasedGenerator } from '../../scales/linear';

function ticksByCount({ count, minorCount, scale, formatter }) {
  return scale
  .ticks(((count - 1) * minorCount) + count)
  .map((tick, i) => ({
    position: scale.get(tick),
    label: formatter(tick),
    isMinor: i % (minorCount + 1) !== 0,
    value: tick
  }));
}

function ticksByValue({ values, scale, formatter }) {
  return values
    .sort((a, b) => a - b)
    .filter((v, i, ary) => v <= scale.max() && v >= scale.min() && ary.indexOf(v) === i)
    .map(tick => ({
      position: scale.get(tick),
      label: formatter(tick),
      isMinor: false,
      value: tick
    }));
}

function forceTicksAtBounds(ticks, scale, formatter) {
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

    if (settings.ticks.tight && ticks.length > 0) {
      scale.domain(ticks[0].scale.domain()); // TODO find a better way to expose and determine if scale has changed
    }

    if (settings.ticks.forceBounds) {
      forceTicksAtBounds(ticks, scale, formatter);
    }
  }

  return ticks;
}

export function generateDiscreteTicks({ scale }) {
  const dataSet = scale.data().length > 0 ?
    scale.data().map(d => d.self) :
    scale.domain().map(d => ({ value: d }));

  return dataSet.map((d) => { // eslint-disable-line arrow-body-style
    return {
      position: scale(d) + (scale.bandWidth() / 2),
      label: `${'label' in d ? d.label : d.value}`
    };
  });
}
