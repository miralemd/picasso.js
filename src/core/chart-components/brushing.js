export function styler(obj, { context, data, style }) {
  const brusher = obj.composer.brush(context);
  const dataProps = data;
  const active = style.active || {};
  const inactive = style.inactive || {};
  let styleProps = [];
  Object.keys(active).forEach((key) => {
    styleProps.push(key);
  });

  Object.keys(inactive).forEach((key) => {
    if (styleProps.indexOf(key) === -1) {
      styleProps.push(key);
    }
  });

  const update = () => {
    // TODO - render nodes only once, i.e. don't render for each brush, update nodes for all brushes and then render
    const nodes = obj.nodes;
    const len = nodes.length;
    const mappedData = obj.data;

    for (let i = 0; i < len; i++) { // TODO - update only added and removed nodes
      if (!nodes[i].__style) {
        nodes[i].__style = {};
        styleProps.forEach((s) => {
          nodes[i].__style[s] = nodes[i][s]; // store original value
        });
      }

      let nodeData = mappedData[nodes[i].data];
      let isActive = nodeData && brusher.containsMappedData(nodeData, dataProps);
      styleProps.forEach((s) => {
        if (isActive && s in active) {
          nodes[i][s] = active[s];
        } else if (!isActive && s in inactive) {
          nodes[i][s] = inactive[s];
        } else {
          if (!nodes[i].__style) {
            nodes[i].__style = nodes[i].__style || {};
            styleProps.forEach((ss) => {
              nodes[i].__style[ss] = nodes[i][ss]; // store original value
            });
          }
          nodes[i][s] = nodes[i].__style[s];
        }
      });
    }
  };

  const onStart = () => {
    const nodes = obj.nodes;
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      nodes[i].__style = nodes[i].__style || {};
      styleProps.forEach((s) => {
        nodes[i].__style[s] = nodes[i][s]; // store original value
      });
    }
    obj.renderer.render(nodes);
  };
  const onEnd = () => {
    const nodes = obj.nodes;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      if (nodes[i].__style) {
        Object.keys(nodes[i].__style).forEach((s) => {
          nodes[i][s] = nodes[i].__style[s];
        });
        nodes[i].__style = undefined;
      }
    }
    obj.renderer.render(nodes);
  };
  const onUpdate = (/* added, removed */) => {
    update();
    obj.renderer.render(obj.nodes);
  };

  brusher.on('start', onStart);
  brusher.on('end', onEnd);
  brusher.on('update', onUpdate);

  function cleanUp() {
    brusher.removeListener('start', onStart);
    brusher.removeListener('end', onEnd);
    brusher.removeListener('update', onUpdate);
  }

  return {
    isActive() {
      return brusher.isActive();
    },
    cleanUp,
    update
  };
}

function brushDataPoint({
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
  if (action === 'add') {
    actionFn = 'addValues';
  } else if (action === 'remove') {
    actionFn = 'removeValues';
  } else if (action === 'set' || action === 'hover') {
    actionFn = 'setValues';
  }


  if (dataPoint !== null) {
    dataProps.forEach((p) => {
      if (dataPoint[p]) {
        items.push({ key: dataPoint[p].source.field, value: dataPoint[p].value });
      }
    });

    config.contexts.forEach((c) => {
      composer.brush(c)[actionFn](items);
    });
  } else if (action === 'hover') {
    config.contexts.forEach((c) => {
      composer.brush(c).clear();
      composer.brush(c).end();
    });
  }
}

export function endBrush({
  composer,
  config
}) {
  if (!config) {
    return;
  }
  (config.contexts || []).forEach((c) => {
    composer.brush(c).clear();
    composer.brush(c).end();
  });
}

function brushFromSceneNode({
  node,
  action,
  composer,
  data,
  config
}) {
  const dataAttrib = node.data;
  const dataPoint = dataAttrib !== null ? data[+dataAttrib] : null;

  brushDataPoint({
    dataPoint,
    action,
    composer,
    config
  });
}

function uniqueDataCollisions(collisions, data, config) {
  const dataProps = config.data || ['self'];

  const uniqueCollisions = [];
  const values = [];

  collisions.forEach((c) => {
    // Check if collision has unique data values
    const isUnique = dataProps.every((dp) => {
      const dataPoint = data[c.node.data];
      const v = dataPoint[dp].value;
      if (values.indexOf(v) !== -1) {
        return false;
      }
      values.push(v);
      return true;
    });

    if (isUnique) {
      uniqueCollisions.push(c);
    }
  });

  return uniqueCollisions;
}

function resolveEvent({ collisions, t, config, action }) {
  let brushCollisions = [{ node: { data: null } }];
  let resolved = false;

  if (collisions.length > 0) {
    brushCollisions = collisions;
    resolved = true;

    if (t.propagation === 'stop') {
      brushCollisions = [collisions[collisions.length - 1]];
    } else if (t.propagation === 'data') {
      brushCollisions = uniqueDataCollisions(collisions, config.data, t);
    }
  }

  brushCollisions.forEach((collision) => {
    brushFromSceneNode({
      node: collision.node,
      action,
      composer: config.composer,
      data: config.data,
      config: t
    });
  });

  return resolved;
}

export function resolveTapEvent({ e, t, config }) {
  const rect = config.renderer.element().getBoundingClientRect();

  const p = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  if (p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) {
    return false;
  }

  const collisions = config.renderer.itemsAt(p);

  return resolveEvent({ collisions, t, config, action: 'toggle' });
}

export function resolveOverEvent({ e, t, config }) {
  const rect = config.renderer.element().getBoundingClientRect();

  const p = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  if (p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) {
    return false;
  }

  const collisions = config.renderer.itemsAt(p);

  return resolveEvent({ collisions, t, config, action: 'hover' });
}
