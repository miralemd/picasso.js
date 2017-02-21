function extractFieldFromId(id) {
  const DIM_RX = /\/qDimensionInfo(?:\/(\d+))?/;
  const M_RX = /\/qMeasureInfo\/(\d+)/;

  let isDimension = DIM_RX.test(id);
  let fieldMatch = isDimension ? DIM_RX.exec(id) : M_RX.exec(id);
  let path = `${id.substr(0, id.indexOf('/qHyperCube'))}/qHyperCubeDef`;
  let index = 0;
  if (fieldMatch !== null) {
    index = +fieldMatch[1];
  }

  return {
    index,
    path,
    type: isDimension ? 'dimension' : 'measure'
  };
}

export default function qBrush(brush, { byCells, primarySource } = {}) {
  let selections = [];
  let methods = {};
  let isActive = brush.isActive();
  let hasValues = false;
  brush.brushes().forEach((b) => {
    let info = extractFieldFromId(b.id);
    if (b.type === 'range' && info.type === 'measure') {
      let ranges = b.brush.ranges();
      if (ranges.length) {
        hasValues = true;
        if (!methods.rangeSelectHyperCubeValues) {
          methods.rangeSelectHyperCubeValues = {
            path: info.path,
            ranges: []
          };
        }
        methods.rangeSelectHyperCubeValues.ranges.push({
          qMeasureIx: info.index,
          qRange: {
            qMin: ranges[0].min,
            qMax: ranges[0].max,
            qMinInclEq: true,
            qMaxInclEq: true
          }
        });
      }
    }
    if (b.type === 'value' && info.type === 'dimension') {
      if (byCells) {
        if (!methods.selectHyperCubeCells) {
          methods.selectHyperCubeCells = {
            path: info.path,
            cols: []
          };
        }

        methods.selectHyperCubeCells.cols.push(info.index);
        if (b.id === primarySource || (!primarySource && !methods.selectHyperCubeCells.values)) {
          methods.selectHyperCubeCells.values = b.brush.values().map(s => +s).filter(v => !isNaN(v));
          hasValues = !!methods.selectHyperCubeCells.values.length;
        }
      } else {
        const values = b.brush.values().map(s => +s).filter(v => !isNaN(v));
        hasValues = !!values.length;
        selections.push({
          params: [info.path, info.index, values, false],
          method: 'selectHyperCubeValues'
        });
      }
    }
  });

  if (!hasValues && isActive) {
    return [{
      method: 'resetMadeSelections',
      params: []
    }];
  }

  if (methods.rangeSelectHyperCubeValues) {
    selections.push({
      method: 'rangeSelectHyperCubeValues',
      params: [methods.rangeSelectHyperCubeValues.path, methods.rangeSelectHyperCubeValues.ranges]
    });
  }

  if (methods.selectHyperCubeCells) {
    selections.push({
      method: 'selectHyperCubeCells',
      params: [methods.selectHyperCubeCells.path, methods.selectHyperCubeCells.values, methods.selectHyperCubeCells.cols]
    });
  }

  return selections;
}
