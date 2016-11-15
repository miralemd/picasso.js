import { default as extend } from 'extend';

export default function doodler(settings) {
  function doodle() {
    doodle.push = v => v;
    doodle.settings = settings || { style: {} };
    return doodle;
  }

  doodle.style = function (object, styleName, style = {}) {
    return extend(object, style[styleName] || {});
  };

  doodle.postfill = function (object, key, fill) {
    doodle.settings.style = doodle.settings.style || {};
    doodle.settings.style[object] = doodle.settings.style[object] || {};
    doodle.settings.style[object][key] = doodle.settings.style[object][key] * fill || fill;
  };

  doodle.horizontalLine = function (x, y, width, styleName, style) {
    return doodle.push(
      doodle.style({
        type: 'line',
        y1: y,
        x1: x - (width / 2),
        y2: y,
        x2: x + (width / 2)
      },
        styleName,
        style)
    );
  };

  doodle.verticalLine = function (x, y1, y2, styleName, style) {
    return doodle.push(
      doodle.style({
        type: 'line',
        y1,
        x1: x,
        y2,
        x2: x
      },
        styleName,
        style)
    );
  };

  doodle.whisker = function (x, y, style) {
    const width = doodle.settings.style.whisker.width;

    return doodle.push(
      doodle.style({
        type: 'line',
        y1: y,
        x1: x - (width / 2),
        cx: x,
        cy: y,
        r: width / 2,
        y2: y,
        x2: x + (width / 2)
      },
        'whisker',
        style)
    );
  };

  doodle.openwhisker = function (x, y, style) {
    return doodle.whisker(
      x - (doodle.settings.style.whisker.width / 2),
      y,
      style
    );
  };

  doodle.closewhisker = function (x, y, style) {
    return doodle.whisker(
      x + (doodle.settings.style.whisker.width / 2),
      y,
      style
    );
  };

  doodle.median = function (x, y, style) {
    return doodle.horizontalLine(
      x,
      y,
      doodle.settings.style.box.width,
      'med',
      style
    );
  };

  doodle.box = function (x, y, height, name, style) {
    return doodle.push(
      doodle.style({
        type: 'rect',
        x: x - (doodle.settings.style[name].width / 2),
        y,
        height,
        width: doodle.settings.style[name].width
      },
        name,
        style)
    );
  };

  return doodle();
}
