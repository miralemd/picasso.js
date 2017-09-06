function applyAlignJustify(ctx, node) {
  let wiggle = 0;
  const cmd = {
    type: ctx.state.isVertical ? 'justify' : 'align',
    coord: ctx.state.isVertical ? 'y' : 'x',
    pos: ctx.state.isVertical ? 'height' : 'width',
    fn: ctx.state.isVertical ? 'requiredHeight' : 'requiredWidth'
  };

  wiggle = ctx.state.rect[cmd.pos] - ctx.state.legend.length() - ctx.state.title[cmd.fn]();
  wiggle *= Math.min(1, Math.max(ctx.settingsDef.legend[cmd.type], 0));
  node[cmd.coord] += wiggle;
}

function generateOffset(ctx) {
  const offset = ctx.scale.domain().map(d => ctx.scale.norm(d));
  const isInverted = offset[0] > offset[offset.length - 1];

  if (isInverted & ctx.state.isVertical) { // Given input is [1, 0.2, 0], then output should be [0, 0.2, 1]
    return offset.reverse();
  } else if (ctx.state.isVertical) { // Given input is [0, 0.2, 1], then output should be [0, 0.8, 1]
    return offset.reverse().map(o => 1 - o);
  } else if (isInverted) { // Given input is [1, 0.8, 0], then output should be [0, 0.2, 1]
    return offset.map(o => 1 - o);
  }

  return offset;
}

export function generateStopNodes(ctx) {
  const offset = generateOffset(ctx);
  const scale = ctx.scale;
  const domain = ctx.state.isVertical ? scale.domain().reverse() : scale.domain();
  let stops = domain.map((d, i) => ({
    type: 'stop',
    color: scale(d),
    offset: offset[i]
  }));

  return stops;
}

export function createTitleNode(ctx) {
  const state = ctx.state;
  const settings = ctx.settingsDef;
  const isTickLeft = state.ticks.anchor === 'left';
  let x = state.rect.x;
  let y = state.rect.y;
  let textAnchor = 'start';

  if (state.title.anchor === 'left') {
    x += state.title.requiredWidth() - settings.title.padding;
    y += state.title.requiredHeight();
    y += state.ticks.requiredHeight();
    textAnchor = 'end';
  } else if (state.title.anchor === 'right') {
    x += state.legend.length();
    x += settings.title.padding;
    y += state.title.textMetrics.height;
    y += state.ticks.requiredHeight();
  } else if (state.title.anchor === 'top') {
    x += isTickLeft ? state.rect.width : 0;
    y += state.title.textMetrics.height;
    textAnchor = isTickLeft ? 'end' : 'start';
  }

  const node = {
    type: 'text',
    x,
    y: Math.min(y, state.rect.y + state.rect.height),
    text: settings.title.text,
    fill: settings.title.fill,
    fontSize: settings.title.fontSize,
    fontFamily: settings.title.fontFamily,
    maxWidth: settings.title.maxLengthPx,
    anchor: textAnchor
  };

  applyAlignJustify(ctx, node);
  return node;
}

export function createLegendRectNode(ctx, stops) {
  const state = ctx.state;
  const settings = ctx.settingsDef;
  const container = state.rect;
  let x = container.x;
  let y = container.y;
  let width = state.isVertical ? settings.legend.size : state.legend.length();
  let height = state.isVertical ? state.legend.length() : settings.legend.size;

  if (state.ticks.anchor === 'left') {
    x += state.rect.width - settings.legend.size;
  } else if (state.ticks.anchor === 'top') {
    y += state.rect.height - settings.legend.size;
  }

  if (state.title.anchor === 'top') {
    y += state.title.requiredHeight();
  } else if (state.title.anchor === 'left') {
    x += state.title.requiredWidth();
  }

  const node = {
    type: 'rect',
    x,
    y,
    width,
    height,
    fill: {
      type: 'gradient',
      stops,
      degree: state.isVertical ? 90 : 180
    }
  };

  applyAlignJustify(ctx, node);
  return node;
}

export function createTickNodes(ctx, legendNode) {
  const state = ctx.state;
  const settings = ctx.settingsDef;
  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = 0;
  let anchor = 'start';

  const nodes = state.ticks.values.map((tick, i, ary) => { // Deal with invert
    const m = i / Math.max(1, ary.length - 1);
    dy = state.isVertical && i === 1 ? -(tick.textMetrics.height / 5) : tick.textMetrics.height;

    if (state.ticks.anchor === 'right') {
      x = legendNode.x + settings.legend.size + settings.tick.padding;
      y = legendNode.y + (legendNode.height * m);
    } else if (state.ticks.anchor === 'left') {
      x = legendNode.x - settings.tick.padding;
      y = legendNode.y + (legendNode.height * m);
      anchor = 'end';
    } else if (state.ticks.anchor === 'top') {
      x = legendNode.x + (legendNode.width * m);
      y = state.rect.y;
      anchor = i === 0 ? 'start' : 'end';
    } else if (state.ticks.anchor === 'bottom') {
      x = legendNode.x + (legendNode.width * m);
      y = legendNode.y + legendNode.height + settings.tick.padding;
      anchor = i === 0 ? 'start' : 'end';
    }

    const node = {
      type: 'text',
      x,
      y,
      dx,
      dy,
      text: tick.label,
      fontSize: settings.tick.fontSize,
      fontFamily: settings.tick.fontFamily,
      fill: settings.tick.fill,
      maxWidth: state.isVertical ? settings.tick.maxLengthPx : Math.min(settings.tick.maxLengthPx, state.legend.length() / 2),
      anchor
    };

    return node;
  });

  return nodes;
}
