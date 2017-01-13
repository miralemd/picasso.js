import extend from 'extend';

export default function doodler(settings) {
  function doodle() {
    doodle.settings = settings || { style: {} };
    return doodle;
  }

  doodle.style = function styleFn(object, styleName, style = {}) {
    return extend(object, style[styleName] || {});
  };

  doodle.horizontalLine = function horizontalLine(x, y, width, styleName, style = {}) {
    return doodle.style({
      type: 'line',
      y1: y,
      x1: x - (width / 2),
      y2: y,
      x2: x + (width / 2)
    },
      styleName,
      style
    );
  };

  doodle.verticalLine = function verticalLine(x, y1, y2, styleName, style = {}) {
    return doodle.style({
      type: 'line',
      y1,
      x1: x,
      y2,
      x2: x
    },
      styleName,
      style
    );
  };

  doodle.whisker = function whisker(x, y, style = { whisker: {} }) {
    const width = style.whisker.width || 1;
    return doodle.style({
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
      style
    );
  };

  doodle.openwhisker = function openwhisker(x, y, style = { whisker: {} }) {
    const width = style.whisker.width || 1;
    return doodle.whisker(
      x - (width / 2),
      y,
      style
    );
  };

  doodle.closewhisker = function closewhisker(x, y, style = { whisker: {} }) {
    const width = style.whisker.width || 1;
    return doodle.whisker(
      x + (width / 2),
      y,
      style
    );
  };

  doodle.median = function median(x, y, style = { box: {} }) {
    const width = style.box.width || 1;
    return doodle.horizontalLine(
      x,
      y,
      width,
      'median',
      style
    );
  };

  doodle.box = function box(x, y, height, style = { box: {} }) {
    const width = style.box.width || 1;
    return doodle.style({
      type: 'rect',
      x: x - (width / 2),
      y,
      height,
      width
    },
      'box',
      style
    );
  };

  return doodle();
}
