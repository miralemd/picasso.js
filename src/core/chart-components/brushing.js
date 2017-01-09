export function styler(context, name, style) {
  let consumers = context.config.consume || [];
  consumers = consumers.filter(c => c.context === name);
  if (!consumers.length) {
    return;
  }
  const brusher = context.composer.brush(name);
  const dataProps = consumers[0].data;

  brusher.on('start', () => {
    const nodes = context.nodes;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      nodes[i].__style = nodes[i].__style || {}; // store original value
      Object.keys(style.active).forEach((s) => {
        nodes[i].__style[s] = nodes[i][s];
        if (style.inactive) {
          nodes[i][s] = style.inactive[s];
        }
      });
    }
    context.renderer.render(nodes);
  });
  brusher.on('end', () => {
    const nodes = context.nodes;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      Object.keys(nodes[i].__style).forEach((s) => {
        nodes[i][s] = nodes[i].__style[s];
      });
      delete nodes[i].__style;
    }
    context.renderer.render(nodes);
  });
  brusher.on('update', (/* added, removed */) => {
    // TODO - render nodes only once, i.e. don't render for each brush, update nodes for all brushes and then render
    const nodes = context.nodes;
    const len = nodes.length;
    const mappedData = context.data;

    for (let i = 0; i < len; i++) { // TODO - update only added and removed nodes
      let nodeData = mappedData[nodes[i].data];
      if (nodeData && brusher.containsMappedData(nodeData, dataProps)) {
        Object.keys(style.active).forEach((s) => {
          nodes[i][s] = style.active[s];
        });
      } else if (!style.inactive) {
        Object.keys(style.active).forEach((s) => {
          nodes[i][s] = nodes[i].__style[s];
        });
      } else {
        Object.keys(style.inactive).forEach((s) => {
          nodes[i][s] = style.inactive[s];
        });
      }
    }
    context.renderer.render(nodes);
  });
}

function getPointData(e) {
  const target = e.target;
  return target.getAttribute('data');
}

export function brushDataPoint({
  dataPoint,
  action,
  composer,
  config
}) {
  if (typeof dataPoint === 'undefined' || !config) {
    return;
  }

  const dataProps = config.data || ['self'];
  let items = [];

  let actionFn = 'toggleValues';
  if (action === 'add' || action === 'hover') {
    actionFn = 'addValues';
  } else if (action === 'remove') {
    actionFn = 'removeValues';
  }

  if (dataPoint !== null) {
    dataProps.forEach((p) => {
      items.push({ key: dataPoint[p].source.field, value: dataPoint[p].value });
    });

    config.contexts.forEach((c) => {
      composer.brush(c)[actionFn](items);
    });
  } else if (action === 'hover') {
    config.contexts.forEach((c) => {
      composer.brush(c).clear();
    });
  }
}

export function brushFromDomElement({
  e,
  action,
  composer,
  data,
  config
}) {
  const dataAttrib = getPointData(e);
  const dataPoint = dataAttrib !== null ? data[+dataAttrib] : null;

  brushDataPoint({
    dataPoint,
    action,
    composer,
    config
  });
}
