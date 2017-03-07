import { isTouchEvent } from '../utils/event-type';

export function reduceToLeafNodes(nodes = []) {
  return nodes.reduce((ary, node) => {
    if (Array.isArray(node.children)) {
      return ary.concat(reduceToLeafNodes(node.children));
    }
    ary.push(node);
    return ary;
  }, []);
}

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
    const nodes = reduceToLeafNodes(obj.nodes);
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
    const nodes = reduceToLeafNodes(obj.nodes);
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      nodes[i].__style = nodes[i].__style || {};
      styleProps.forEach((s) => {
        nodes[i].__style[s] = nodes[i][s]; // store original value
      });
    }
    obj.renderer.render(obj.nodes);
  };

  const onEnd = () => {
    const nodes = reduceToLeafNodes(obj.nodes);
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      if (nodes[i].__style) {
        Object.keys(nodes[i].__style).forEach((s) => {
          nodes[i][s] = nodes[i].__style[s];
        });
        nodes[i].__style = undefined;
      }
    }
    obj.renderer.render(obj.nodes);
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
  } else if (action === 'set') {
    actionFn = 'setValues';
  }

  if (dataPoint !== null) {
    dataProps.forEach((p) => {
      if (dataPoint[p]) {
        items.push({ key: dataPoint[p].source.field, value: dataPoint[p].value });
      }
    });
  }

  config.contexts.forEach((c) => {
    composer.brush(c)[actionFn](items);
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

function touchSingleContactPoint(e, rect) {
  if (e.changedTouches.length !== 1) {
    return null;
  }

  return {
    x: e.changedTouches[0].clientX - rect.left,
    y: e.changedTouches[0].clientY - rect.top
  };
}

function singleContactPoint(e, rect) {
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function resolveCollisions(e, t, renderer) {
  const rect = renderer.element().getBoundingClientRect();
  let p = isTouchEvent(e) ? touchSingleContactPoint(e, rect) : singleContactPoint(e, rect);

  if (p === null || p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) { // TODO include radius in this check?
    return [];
  }

  if (t.touchRadius > 0 && isTouchEvent(e)) {
    p = {
      cx: p.x,
      cy: p.y,
      r: t.touchRadius // TODO Use touch event radius/width value (Need to handle dpi scaling as well)
    };
  }

  return renderer.itemsAt(p);
}


function resolveAction(action, e, def) {
  if (action) {
    if (typeof action === 'function') {
      return action(e);
    }
    return action;
  }
  return def;
}

export function resolveTapEvent({ e, t, config }) {
  const collisions = resolveCollisions(e, t, config.renderer);

  return resolveEvent({ collisions, t, config, action: resolveAction(t.action, e, 'toggle') });
}

export function resolveOverEvent({ e, t, config }) {
  const collisions = resolveCollisions(e, t, config.renderer);

  return resolveEvent({ collisions, t, config, action: resolveAction(t.action, e, 'set') });
}