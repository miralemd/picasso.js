const ALPHA_MULTIPLIER = 0.3;

// TODO - allow configuration of how to style highlighted shapes
export function highlighter(context) {
  const brusher = context.composer.brush('highlight');
  brusher.on('start', () => {
    const nodes = context.nodes;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      nodes[i].__opacity = nodes[i].opacity; // store original value
      nodes[i].opacity = nodes[i].__opacity * ALPHA_MULTIPLIER;
    }
    context.renderer.render(nodes);
  });
  brusher.on('end', () => {
    const nodes = context.nodes;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      nodes[i].opacity = nodes[i].__opacity; // restore original value
    }
    context.renderer.render(nodes);
  });
  brusher.on('update', (/* added, removed */) => {
    // console.log(added, removed);
    const nodes = context.nodes;
    const len = nodes.length;
    const mappedData = context.data;

    for (let i = 0; i < len; i++) { // TODO - find a more efficient way to update opacity
      let nodeData = mappedData[nodes[i].data];
      if (nodeData && brusher.containsMappedData(nodeData)) {
        nodes[i].opacity = nodes[i].__opacity;
      } else {
        nodes[i].opacity = nodes[i].__opacity * ALPHA_MULTIPLIER;
      }
    }
    context.renderer.render(nodes);
  });
}

// export function hoverer(context) {
//   const brusher = context.composer.brush('hover');
//   brusher.on('update', () => {
//     const brushes = brusher.brushes().filter(b => b.type === 'value');
//     const hoveredData = brushes[0] ? brushes[0].brush.values() : [];
//     console.log('hovered data', hoveredData);
//   });
// }

export function brushDataPoint({
  e,
  brushType,
  action,
  composer,
  data
}) {
  const target = e.target;
  const dataAttrib = target.getAttribute('data');
  const b = composer.brush(brushType);
  let actionFn = 'toggleValue';
  if (action === 'add') {
    actionFn = 'addValue';
  } else if (action === 'remove') {
    actionFn = 'removeValue';
  }
  if (dataAttrib !== null) {
    if (data) {
      const dataPoint = data[+dataAttrib];
      b[actionFn](dataPoint.self.source.field, dataPoint.self.value);
    }
  } else if (brushType === 'hover') {
    b.clear();
  }
}
