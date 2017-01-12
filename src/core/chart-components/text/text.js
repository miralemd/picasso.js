import extend from 'extend';

import createComponentFactory from '../component';

function parseTitle(text, join, table, scale) {
  let title;
  if (typeof text === 'function') {
    title = text(table);
  } else if (typeof text === 'string') {
    title = text;
  } else if (scale && scale.sources) {
    if (Array.isArray(scale.sources)) {
      const titles = scale.sources.map(s => table.findField(s).title());
      title = titles.join(join || ', ');
    } else {
      title = table.findField(scale.sources).title();
    }
  } else {
    title = '';
  }

  return title;
}

function getTextAnchor(dock, anchor) {
  let val = 'middle';
  if (dock === 'left') {
    if (anchor === 'top') {
      val = 'end';
    } else if (anchor === 'bottom') {
      val = 'start';
    }
  } else if (dock === 'right') {
    if (anchor === 'top') {
      val = 'start';
    } else if (anchor === 'bottom') {
      val = 'end';
    }
  } else if (anchor === 'left') {
    val = 'start';
  } else if (anchor === 'right') {
    val = 'end';
  }
  return val;
}

function generateTitle({
  title,
  settings,
  dock,
  rect,
  measureText
}) {
  const struct = {
    type: 'text',
    text: title,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    anchor: getTextAnchor(dock, settings.anchor),
    baseline: 'alphabetical'
  };

  extend(struct, settings.style);
  const textRect = measureText(struct);

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


const textComponent = {
  require: ['renderer', 'composer'],
  defaultSettings: {
    dock: 'bottom',
    displayOrder: 99,
    prioOrder: 0,
    anchor: 'center',
    paddingStart: 5,
    paddingEnd: 5,
    paddingLeft: 0,
    paddingRight: 0,
    style: {
      fontSize: '15px',
      fontFamily: 'Arial',
      fill: '#999'
    },
    settings: {},
    join: ', '
  },
  created() {
    this.rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    extend(this.settings, this.settings.settings || {});

    this.dataset = this.composer.dataset();
    const table = this.dataset.tables()[0];
    const text = this.settings.text;
    const join = this.settings.settings && this.settings.settings.join;
    this.title = parseTitle(text, join, table, this.scale);
  },
  preferredSize() {
    const height = this.renderer.measureText({
      text: this.title,
      fontSize: this.settings.style.fontSize,
      fontFamily: this.settings.style.fontFamily
    }).height;
    return height + this.settings.paddingStart + this.settings.paddingEnd;
  },
  beforeRender(opts) {
    const {
      inner
    } = opts;
    extend(this.rect, inner);
    return inner;
  },
  render() {
    const {
      title,
      settings,
      rect
    } = this;
    const nodes = [];
    nodes.push(generateTitle({
      title,
      dock: this.settings.dock,
      settings,
      rect,
      measureText: this.renderer.measureText
    }));
    return nodes;
  },
  beforeUpdate(opts) {
    if (opts.settings) {
      extend(this.settings, opts.settings.settings || {});
    }
    const table = this.dataset.tables()[0];
    const text = opts.settings.text;
    const join = opts.settings.settings && opts.settings.settings.join;
    this.title = parseTitle(text, join, table, this.scale);
  }
};

export default createComponentFactory(textComponent);
