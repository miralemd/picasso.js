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

export default function qBrush(brush) {
  let selections = [];
  brush.brushes().forEach((b) => {
    let info = extractFieldFromId(b.id);
    if (b.type === 'range' && info.type === 'measure') {
      let ranges = b.brush.ranges();
      if (ranges.length) {
        selections.push({
          params: [info.path, [{
            qMeasureIx: info.index,
            qRange: {
              qMin: ranges[0].min,
              qMax: ranges[0].max,
              qMinInclEq: true,
              qMaxInclEq: true
            }
          }], [], true],
          method: 'rangeSelectHyperCubeValues'
        });
      }
    }
    if (b.type === 'value' && info.type === 'dimension') {
      selections.push({
        params: [info.path, info.index, b.brush.values().map(s => +s), false],
        method: 'selectHyperCubeValues'
      });
    }
  });
  return selections;
}
