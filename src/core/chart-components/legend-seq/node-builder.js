function applyAlignJustify(ctx, node) {
  let wiggle = 0;
  const cmd = {
    type: ctx.state.isVertical ? 'justify' : 'align',
    coord: ctx.state.isVertical ? 'y' : 'x',
    pos: ctx.state.isVertical ? 'height' : 'width',
    fn: ctx.state.isVertical ? 'requiredHeight' : 'requiredWidth'
  };

  wiggle = ctx.state.rect[cmd.pos] - ctx.state.legend.length() - ctx.state.title[cmd.fn]();
  wiggle *= Math.min(1, Math.max(ctx.stgns[cmd.type], 0));
  node[cmd.coord] += wiggle;
}

export function generateStopNodes(ctx) {
  const fillScale = ctx.state.legend.fillScale;
  const majorScale = ctx.state.legend.majorScale;
  const stops = fillScale.domain().map(d => ({
    type: 'stop',
    color: fillScale(d),
    offset: Math.min(1, Math.max(0, majorScale.norm(d)))
  }));

  return stops.sort((a, b) => a.offset - b.offset);
}

export function createTitleNode(ctx) {
  const state = ctx.state;
  const settings = ctx.stgns;
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
  const settings = ctx.stgns;
  const container = state.rect;
  let x = container.x;
  let y = container.y;
  let width = state.isVertical ? settings.size : state.legend.length();
  let height = state.isVertical ? state.legend.length() : settings.size;

  if (state.ticks.anchor === 'left') {
    x += state.rect.width - settings.size;
  } else if (state.ticks.anchor === 'top') {
    y += state.rect.height - settings.size;
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
  const settings = ctx.stgns;
  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = 0;
  let anchor = 'start';
  const rangeSelectorRect = {
    type: 'rect',
    x: legendNode.x,
    y: legendNode.y,
    width: state.isVertical ? 0 : legendNode.width,
    height: state.isVertical ? legendNode.height : 0,
    fill: 'transparent'
  };

  const nodes = state.ticks.values.map((tick) => {
    dy = state.isVertical && tick.pos === 1 ? -(tick.textMetrics.height / 5) : tick.textMetrics.height;

    if (state.ticks.anchor === 'right') {
      x = legendNode.x + settings.size + settings.tick.padding;
      y = legendNode.y + (legendNode.height * tick.pos);

      rangeSelectorRect.x = legendNode.x + legendNode.width;
    } else if (state.ticks.anchor === 'left') {
      x = legendNode.x - settings.tick.padding;
      y = legendNode.y + (legendNode.height * tick.pos);
      anchor = 'end';
    } else if (state.ticks.anchor === 'top') {
      x = legendNode.x + (legendNode.width * tick.pos);
      y = state.rect.y;
      anchor = tick.pos === 0 ? 'start' : 'end';
    } else if (state.ticks.anchor === 'bottom') {
      x = legendNode.x + (legendNode.width * tick.pos);
      y = legendNode.y + legendNode.height + settings.tick.padding;
      anchor = tick.pos === 0 ? 'start' : 'end';

      rangeSelectorRect.y = legendNode.y + legendNode.height;
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
      anchor,
      width: tick.textMetrics.width,
      height: tick.textMetrics.height
    };

    return node;
  });

  return {
    type: 'container',
    id: 'legend-seq-ticks',
    children: [...nodes, rangeSelectorRect]
  };
}