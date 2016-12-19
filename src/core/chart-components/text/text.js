import extend from 'extend';
import dockConfig from '../../dock-layout/dock-config';

function calcRequiredSize(title, settings, renderer) {
  const fn = function () {
    const args = { text: title, fontSize: settings.style.fontSize, fontFamily: settings.style.fontFamily };
    return renderer.measureText(args).height + settings.paddingStart + settings.paddingEnd;
  };

  return fn;
}

function parseTitle(config, table, scale) {
  let title;
  if (typeof config.text === 'function') {
    title = config.text(table);
  } else if (typeof config.text === 'string') {
    title = config.text;
  } else if (scale && scale.sources) {
    if (Array.isArray(scale.sources)) {
      const titles = scale.sources.map(s => table.findField(s).title());
      title = titles.join(config.settings.join || ', ');
    } else {
      title = table.findField(scale.sources).title();
    }
  } else {
    title = '';
  }

  return title;
}

function getTextAnchor(settings) {
  let anchor = 'middle';
  if (settings.dock === 'left') {
    if (settings.anchor === 'top') {
      anchor = 'end';
    } else if (settings.anchor === 'bottom') {
      anchor = 'start';
    }
  } else if (settings.dock === 'right') {
    if (settings.anchor === 'top') {
      anchor = 'start';
    } else if (settings.anchor === 'bottom') {
      anchor = 'end';
    }
  } else if (settings.anchor === 'left') {
    anchor = 'start';
  } else if (settings.anchor === 'right') {
    anchor = 'end';
  }
  return anchor;
}

function generateTitle({ title, settings, dock, rect, renderer }) {
  const struct = {
    type: 'text',
    text: title,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    anchor: getTextAnchor(settings),
    baseline: 'alphabetical'
  };

  extend(struct, settings.style);
  const textRect = renderer.measureText(struct);

  if (dock === 'top' || dock === 'bottom') {
    let x = rect.width / 2;
    if (settings.anchor === 'left') {
      x = settings.paddingLeft || 0;
    } else if (settings.anchor === 'right') {
      x = rect.width - (settings.paddingRight || 0);
    }

    struct.x = x;
    struct.y = dock === 'top' ? rect.height - settings.paddingStart : settings.paddingStart + textRect.height;
    struct.dy = dock === 'top' ? -(textRect.height / 6) : -(textRect.height / 3);
    struct.maxWidth = rect.width * 0.8;
    if (settings.maxWidth) {
      struct.maxWidth = Math.min(struct.maxWidth, settings.maxWidth);
    }
  } else {
    let y = rect.height / 2;
    if (settings.anchor === 'top') {
      y = settings.paddingStart;
    } else if (settings.anchor === 'bottom') {
      y = rect.height - settings.paddingStart;
    }

    struct.y = y;
    struct.x = dock === 'left' ? rect.width - settings.paddingStart : settings.paddingStart;
    struct.dx = dock === 'left' ? -(textRect.height / 3) : (textRect.height / 3);
    const rotation = dock === 'left' ? 270 : 90;
    struct.transform = `rotate(${rotation}, ${struct.x + struct.dx}, ${struct.y + struct.dy})`;
    struct.maxWidth = rect.height * 0.8;
  }

  return struct;
}

export default function text(config, composer, renderer) {
  let settings = extend({
      dock: 'bottom',
      anchor: 'center',
      displayOrder: 99,
      prioOrder: 0,
      paddingStart: 5,
      paddingEnd: 5,
      paddingLeft: 0,
      paddingRight: 0,
      style: {
        fontSize: '15px',
        fontFamily: 'Arial',
        fill: '#999'
      },
      join: ', '
    }, config.settings),
    table = composer.table(),
    scale = config.scale ? composer.scale(config.scale) : undefined,
    nodes = [],
    rect = { x: 0, y: 0, width: 0, height: 0 },
    dock = config.settings.dock,
    title;

  const fn = function () {
    title = parseTitle(config, table, scale);
    fn.dockConfig.requiredSize(calcRequiredSize(title, settings, renderer));
    fn.dockConfig.dock(dock);
    fn.dockConfig.displayOrder(settings.displayOrder);
    fn.dockConfig.prioOrder(settings.prioOrder);
    return fn;
  };

  fn.resize = (inner) => {
    renderer.size(inner);
    extend(rect, inner);
  };

  fn.render = () => {
    nodes.push(generateTitle({ title, settings, dock, rect, renderer }));
    renderer.render(nodes);
  };

  fn.dockConfig = dockConfig();

  return fn();
}
