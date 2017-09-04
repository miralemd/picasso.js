import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { normalizeSettings, resolveForItem } from '../../property-resolver';

function resolveInitialStyle(settings, baseStyles, chart) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = normalizeSettings(settings[s], baseStyles[s], chart);
  });
  return ret;
}

export default function dispersion(chart, defaultStyles = {}, initialSettings = {}) {
  let settings = initialSettings;
  let major;
  let minor;
  let bandwidth;
  let minDataPointDistance;
  let blueprint;
  let doodle;
  let items;
  let resolvedStyle;

  const fn = () => fn;

  fn.updateSettings = (stngs) => {
    // Setup settings and data
    settings = stngs.settings;

    // Setup scales
    major = settings.major ? chart.scale(settings.major) : null;
    minor = settings.minor ? chart.scale(settings.minor) : null;

    // Set the default bandwidth
    bandwidth = 0;

    // Set the minimum data point distance
    minDataPointDistance = null;

    // Initialize blueprint and doodler
    blueprint = transposer();
    doodle = doodler(settings);
  };

  fn.onData = (data, rect) => {
    items = [];
    resolvedStyle = resolveInitialStyle(settings, defaultStyles, chart);

    if (major && major.pxScale) {
      const flipXY = settings.orientation === 'horizontal';
      const majorLenght = flipXY ? rect.height : rect.width;
      major = major.pxScale(majorLenght);
    }
    if (minor && minor.pxScale) { // is this needed or is minor never a band scale
      const flipXY = settings.orientation === 'horizontal';
      const minorLenght = flipXY ? rect.width : rect.height;
      minor = minor.pxScale(minorLenght);
    }

    const bw = major && major.bandwidth ? major.bandwidth() : 0;

    const majorRef = settings.major ? settings.major.ref || 'self' : 'self';
    const majorStartRef = typeof majorRef === 'object' ? settings.major.ref.start : null;
    const majorEndRef = typeof majorRef === 'object' ? settings.major.ref.end : null;

    // Calculate the minimum data point distance
    if (major && !major.bandwidth && typeof majorRef === 'string') {
      const pointCoords = data.items.map(d => d[majorRef].value);

      // Sort values
      pointCoords.sort((a, b) => a - b);

      let minSpace = pointCoords[pointCoords.length - 1];
      for (let i = 0; i < pointCoords.length; i++) {
        if (pointCoords[i] && pointCoords[i - 1]) {
          if (minSpace === null || minSpace > (pointCoords[i] - pointCoords[i - 1])) {
            minSpace = pointCoords[i] - pointCoords[i - 1];
          }
        }
      }

      minDataPointDistance = minSpace;
    }

    data.items.forEach((d, i, all) => {
      const obj = {};
      Object.keys(resolvedStyle).forEach((part) => {
        // obj[part] = resolveForDataObject(resolvedStyle[part], d, i);
        obj[part] = resolveForItem(d, resolvedStyle[part], all);
      });

      const it = {
        style: obj,
        majorStart: major && d[majorStartRef] ? major(d[majorStartRef].value) : null,
        majorEnd: major && d[majorEndRef] ? major(d[majorEndRef].value) : null,
        min: minor && 'min' in d ? minor(d.min.value) : null,
        max: minor && 'max' in d ? minor(d.max.value) : null,
        start: minor && 'start' in d ? minor(d.start.value) : null,
        end: minor && 'end' in d ? minor(d.end.value) : null,
        med: minor && 'med' in d ? minor(d.med.value) : null,
        data: d
      };

      if (it.majorStart !== null) { // if a majorstart/end are defined, calculate the midpoint
        it.major = (it.majorStart + it.majorEnd) / 2;
      } else {
        it.major = major && d[majorRef] ? major(d[majorRef].value) + (bw / 2) : 0.5;
      }

      items.push(it);
    });
  };

  fn.items = () => items;

  fn.bandwidth = () => bandwidth;

  fn.doodle = () => doodle;

  fn.blueprint = () => blueprint;

  fn.render = (rect, buildShapes) => {
    if (minDataPointDistance !== null) {
      if (minDataPointDistance === 0) {
        minDataPointDistance = 0.000000001;
      }
      const normalizedWidth = major(major.domain()[0]) - major(major.domain()[0] + minDataPointDistance);
      bandwidth = Math.abs(normalizedWidth);
    } else {
      bandwidth = major && major.bandwidth ? major.bandwidth() : 1;
    }

    // Setup the blueprint
    blueprint.reset();
    blueprint.width = rect.width;
    blueprint.height = rect.height;
    blueprint.x = rect.x;
    blueprint.y = rect.y;
    blueprint.flipXY = settings.orientation === 'horizontal';
    blueprint.crisp = true;

    let output = [];

    items.forEach((item) => {
      const shapes = buildShapes({ item, blueprint, doodle });
      shapes.forEach((shape) => {
        shape.data = item.data;
        shape.collider = { type: null };
      });
      output.push(...shapes);
    });

    if (output.length === 0) {
      return output;
    }

    return items.map((item) => {
      const container = {
        type: 'container',
        data: item.data,
        collider: { type: 'bounds' },
        children: []
      };
      for (let i = 0; i < output.length; i++) {
        const o = output[i];
        if (o.data === container.data) {
          container.children.push(o);
          output.splice(i, 1);
          i--;
        }
      }
      return container;
    });
  };

  return fn();
}
