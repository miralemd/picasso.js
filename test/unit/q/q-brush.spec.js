import qBrush from '../../../src/q/brush/q-brush';

describe('q-brush', () => {
  let brush;

  beforeEach(() => {
    brush = {
      isActive: sinon.stub(),
      brushes: sinon.stub()
    };
  });

  it('should return empty when no brushes exist', () => {
    brush.brushes.returns([]);
    expect(qBrush(brush).length).to.equal(0);
  });

  it('should reset made selections when brush is active but contain no values', () => {
    brush.isActive.returns(true);
    brush.brushes.returns([{
      id: '/qHyperCube/qDimensionInfo/2',
      type: 'value',
      brush: {
        values: () => []
      }
    }]);
    const selections = qBrush(brush);
    expect(selections[0].method).to.equal('resetMadeSelections');
    expect(selections[0].params).to.eql([]);
  });

  describe('selectHyperCubeValues', () => {
    beforeEach(() => {
      brush.brushes.returns([{
        id: '/qHyperCube/qDimensionInfo/2',
        type: 'value',
        brush: {
          values: () => [3, 2, 7]
        }
      }]);
    });

    it('should have method="selectHyperCubeValues"', () => {
      const selections = qBrush(brush);
      expect(selections[0].method).to.equal('selectHyperCubeValues');
    });

    it('should have valid params', () => {
      const selections = qBrush(brush);
      expect(selections[0].params).to.eql([
        '/qHyperCubeDef',
        2,
        [3, 2, 7],
        false
      ]);
    });
  });

  describe('rangeSelectHyperCubeValues', () => {
    beforeEach(() => {
      brush.brushes.returns([{
        id: '/qHyperCube/qMeasureInfo/3',
        type: 'range',
        brush: {
          ranges: () => [{ min: 13, max: 17 }]
        }
      }]);
    });

    it('should have method="rangeSelectHyperCubeValues"', () => {
      const selections = qBrush(brush);
      expect(selections[0].method).to.equal('rangeSelectHyperCubeValues');
    });

    it('should have valid params', () => {
      const selections = qBrush(brush);
      expect(selections[0].params).to.eql([
        '/qHyperCubeDef',
        [{ qMeasureIx: 3, qRange: { qMin: 13, qMax: 17, qMinInclEq: true, qMaxInclEq: true } }]
      ]);
    });
  });

  describe('selectHyperCubeCells', () => {
    beforeEach(() => {
      brush.brushes.returns([{
        id: '/layers/0/qHyperCube/qDimensionInfo/2',
        type: 'value',
        brush: {
          values: () => [3, 2, 7]
        }
      }, {
        id: '/layers/0/qHyperCube/qDimensionInfo/1',
        type: 'value',
        brush: {
          values: () => [1, 6, 4]
        }
      }]);
    });

    it('should have method="selectHyperCubeCells"', () => {
      const selections = qBrush(brush, { byCells: true });
      expect(selections[0].method).to.equal('selectHyperCubeCells');
    });

    it('should have valid params when primary is not specified', () => {
      const selections = qBrush(brush, { byCells: true });
      expect(selections[0].params).to.eql([
        '/layers/0/qHyperCubeDef',
        [3, 2, 7],
        [2, 1]
      ]);
    });

    it('should have valid params when primary is specified', () => {
      const selections = qBrush(brush, { byCells: true, primarySource: '/layers/0/qHyperCube/qDimensionInfo/1' });
      expect(selections[0].params).to.eql([
        '/layers/0/qHyperCubeDef',
        [1, 6, 4],
        [2, 1]
      ]);
    });
  });
});
