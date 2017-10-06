import q from '../../src/data/dataset';

describe('magic', () => {
  describe('find field', () => {
    const cube = {
      qSize: { qcx: 3, qcy: 20 },
      qDimensionInfo: [
        {
          qFallbackTitle: 'A',
          qAttrDimInfo: [{}, {
            label: 'title from label',
            qFallbackTitle: 'attr dim title',
            qSize: {},
            qDataPages: 'attr dim table pages'
          }],
          qAttrExprInfo: [{
            qFallbackTitle: 'attr expr title'
          }]
        },
        { qFallbackTitle: 'B' }
      ],
      qMeasureInfo: [
        {},
        {},
        {
          qFallbackTitle: 'C',
          qAttrDimInfo: [{}, {}, {
            qFallbackTitle: 'm attr dim title'
          }],
          qAttrExprInfo: [{}, {
            qFallbackTitle: 'm attr expr title'
          }]
        }
      ],
      qDataPages: [{ qMatrix: [] }]
    };

    const d = q({ key: 'nyckel', data: cube });

    it('should find attribute dimension on dimension', () => {
      const f = d.field('qDimensionInfo/0/qAttrDimInfo/1');
      expect(f.id()).to.eql('nyckel/qDimensionInfo/0/qAttrDimInfo/1');
      expect(f.key()).to.eql('qDimensionInfo/0/qAttrDimInfo/1');
      expect(f.title()).to.eql('attr dim title');
    });

    it('should find attribute expression on dimension', () => {
      const f = d.field('qDimensionInfo/0/qAttrExprInfo/0');
      expect(f.title()).to.eql('attr expr title');
    });

    it('should find attribute dimension on measure', () => {
      const f = d.field('qMeasureInfo/2/qAttrDimInfo/2');
      expect(f.title()).to.eql('m attr dim title');
    });

    it('should find attribute expression on measure', () => {
      const f = d.field('qMeasureInfo/2/qAttrExprInfo/1');
      expect(f.title()).to.eql('m attr expr title');
    });
  });
});
