import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { resolveForDataObject } from '../../../style';
import resolveSettingsForPath from '../../settings-setup';

function resolveInitialStyle(settings, baseStyles, chart) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, chart, s);
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

  fn.onData = (data) => {
    items = [];
    resolvedStyle = resolveInitialStyle(settings, defaultStyles, chart);

    // Calculate the minimum data point distance
    if (major && !major.bandWidth) {
      const pointCoords = data.map(d => d.self.value);

      // Sort values
      pointCoords.sort();

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

    data.forEach((d, i) => {
      const obj = {};
      Object.keys(resolvedStyle).forEach((part) => {
        obj[part] = resolveForDataObject(resolvedStyle[part], d, i);
      });

      items.push({
        style: obj,
        major: major && d.self ? major(d.self) + (major.bandWidth() / 2) : 0.5,
        min: minor && 'min' in d ? minor(d.min) : null,
        max: minor && 'max' in d ? minor(d.max) : null,
        start: minor && 'start' in d ? minor(d.start) : null,
        end: minor && 'end' in d ? minor(d.end) : null,
        med: minor && 'med' in d ? minor(d.med) : null,
        data: i
      });
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
      const normalizedWidth = major({ value: major.domain()[0] }) - major({ value: major.domain()[0] + minDataPointDistance });
      bandwidth = Math.abs(normalizedWidth);
    } else {
      bandwidth = major && major.bandWidth ? major.bandWidth() : 1;
    }

    // Setup the blueprint
    blueprint.reset();
    blueprint.width = rect.width;
    blueprint.height = rect.height;
    blueprint.x = rect.x;
    blueprint.y = rect.y;
    blueprint.flipXY = settings.orientation === 'horizontal';
    blueprint.crisp = true;

    items.forEach((item, idx) => {
      const shapes = buildShapes(item);
      shapes.forEach((shape) => {
        shape.data = idx;
        shape.collider = { type: null };
        blueprint.push(shape);
      });
    });

    const output = blueprint.output();
    if (output.length === 0) {
      return output;
    }
    return items.map((item, idx) => {
      const container = {
        type: 'container',
        data: idx,
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
