import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { resolveForDataObject } from '../../../style';
import resolveSettingsForPath from '../../settings-setup';

function resolveInitialStyle(settings, baseStyles, composer) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, composer, s);
  });
  return ret;
}

export default function dispersion(composer, defaultStyles = {}, initialSettings = {}) {
  let settings = initialSettings;
  let x;
  let y;
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
    x = settings.x ? composer.scale(settings.x) : null;
    y = settings.y ? composer.scale(settings.y) : null;

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
    resolvedStyle = resolveInitialStyle(settings, defaultStyles, composer);

    // Calculate the minimum data point distance
    if (x && x.scale && !x.scale.step) {
      let pointCoords = data.map(d => d.self.value);

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
      let obj = {};
      Object.keys(resolvedStyle).forEach((part) => {
        obj[part] = resolveForDataObject(resolvedStyle[part], d, i);
      });

      items.push({
        style: obj,
        x: x && d.self ? x(d.self) : 0.5,
        min: y && 'min' in d ? y(d.min) : null,
        max: y && 'max' in d ? y(d.max) : null,
        start: y && 'start' in d ? y(d.start) : null,
        end: y && 'end' in d ? y(d.end) : null,
        med: y && 'med' in d ? y(d.med) : null,
        data: i
      });
    });
  };

  fn.items = () => items;

  fn.bandwidth = () => bandwidth;

  fn.doodle = () => doodle;

  fn.render = (rect, buildShapes) => {
    if (minDataPointDistance !== null) {
      if (minDataPointDistance === 0) {
        minDataPointDistance = 0.000000001;
      }
      let normalizedWidth = x({ value: x.scale.domain()[0] }) - x({ value: x.scale.domain()[0] + minDataPointDistance });
      bandwidth = Math.abs(normalizedWidth);
    } else {
      bandwidth = x && x.scale.step ? x.scale.step() : 0.5;
    }

    // Setup the blueprint
    blueprint.reset();
    blueprint.width = rect.width;
    blueprint.height = rect.height;
    blueprint.x = rect.x;
    blueprint.y = rect.y;
    blueprint.vertical = !settings.vertical;
    blueprint.crisp = true;

    items.forEach((item, idx) => {
      const shapes = buildShapes(item);
      shapes.forEach((shape) => {
        shape.data = idx;
        blueprint.push(shape);
      });
    });

    return blueprint.output();
  };

  return fn();
}
