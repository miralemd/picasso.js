function applyFormat(formatter) {
  return typeof formatter === 'undefined' ? t => t : t => formatter(t);
}

function minorTicksGenerator(count, start, end) {
  const r = Math.abs(start - end);
  const interval = r / (count + 1);
  const ticks = [];
  for (let i = 1; i <= count; i++) {
    const v = i * interval;
    ticks.push(start < end ? start + v : start - v);
  }
  return ticks;
}

function appendMinorTicks(majorTicks, minorCount, scale) {
  if (majorTicks.length === 1) { return majorTicks; }

  const ticks = majorTicks.concat([]);

  for (let i = 0; i < majorTicks.length; i++) {
    let start = majorTicks[i];
    let end = majorTicks[i + 1];

    if (i === 0 && start !== scale.start()) { // Before and after first major tick
      ticks.push(...minorTicksGenerator(minorCount, start, end));
      start -= end - start;
      end = majorTicks[i];
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    } else if (i === majorTicks.length - 1 && end !== scale.end()) { // After last major tick
      end = start + (start - majorTicks[i - 1]);
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    } else {
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    }
  }

  return ticks.filter(t => t >= scale.min() && t <= scale.max());
}

/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added
* @private
* @param  {Number} distance       Distance between each tick
* @param  {Number} scale         The scale instance
* @param  {Number} [minorCount=0]     Number of tick added between each distance
* @param  {Number} [unitDivider=100]   Number to divide distance with
* @return {Array}               Array of ticks
*/
export function looseDistanceBasedGenerator({ distance, scale, minorCount = 0, unitDivider = 100, formatter = undefined }) {
  const isNumber = v => typeof v === 'number' && !isNaN(v);
  const count = isNumber(unitDivider) ? Math.max(Math.round(distance / unitDivider), 2) : 2;
  let majorTicks = scale.ticks(count);
  if (majorTicks.length <= 1) {
    majorTicks = scale.ticks(count + 1);
  }

  const ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;
  ticks.sort((a, b) => a - b);

  const ticksFormatted = ticks.map(applyFormat(formatter));

  return ticks.map((tick, i) => ({
    position: scale.get(tick),
    label: ticksFormatted[i],
    value: tick,
    isMinor: majorTicks.indexOf(tick) === -1
  }));
}

/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
* Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.
* @private
* @param  {Number} distance       Distance between each tick
* @param  {Number} scale         The scale instance
* @param  {Number} [minorCount=0]     Number of tick added between each distance
* @param  {Number} [unitDivider=100]   Number to divide distance with
* @return {Array}               Array of ticks
*/
export function tightDistanceBasedGenerator({ distance, scale, minorCount = 0, unitDivider = 100, formatter = undefined }) {
  const isNumber = v => typeof v === 'number' && !isNaN(v);
  const count = isNumber(unitDivider) ? Math.max(Math.round(distance / unitDivider), 2) : 2;
  const n = count > 10 ? 10 : count;
  scale.nice(n);

  const majorTicks = scale.ticks(count);
  const ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;
  ticks.sort((a, b) => a - b);

  const ticksFormatted = ticks.map(applyFormat(formatter));

  return ticks.map((tick, i) => ({
    position: scale.get(tick),
    label: ticksFormatted[i],
    value: tick,
    isMinor: majorTicks.indexOf(tick) === -1
  }));
}

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

export function generateContinuousTicks({ settings, scale, distance, formatter }) {
  let ticks;
  const minorCount = settings.minorTicks ? settings.minorTicks.count : 0;

  if (settings.ticks.values) {
    ticks = ticksByValue({ values: settings.ticks.values, scale: scale.copy(), formatter });
  } else if (settings.ticks.count !== undefined) {
    ticks = ticksByCount({ count: settings.ticks.count, minorCount, scale: scale.copy(), formatter });
  } else {
    // const distance = settings.align === 'top' || settings.align === 'bottom' ? innerRect.width : innerRect.height;
    const tickGen = settings.ticks.tight ? tightDistanceBasedGenerator : looseDistanceBasedGenerator;
    ticks = tickGen({
      distance,
      minorCount,
      unitDivider: settings.ticks.distance,
      scale,
      formatter
    });

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
