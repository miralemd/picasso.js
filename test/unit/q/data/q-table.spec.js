import qTable from '../../../../src/q/data/q-table';

describe('qTable', () => {
  describe('hypercube', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        localeInfo: 'locale specific stuff',
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
          qMeasureInfo: [{ qFallbackTitle: 'C' }],
          qDataPages: [{ qMatrix: [] }]
        }
      });
    });
  /*
    it('should return number of rows', () => {
      expect(q.rows()).to.equal(20);
    });

    it('should return number of cols', () => {
      expect(q.cols()).to.equal(3);
    });
  */
    it('should have 3 fields', () => {
      expect(q.fields().length).to.equal(3);
    });

    it('should find a dimension field', () => {
      expect(q.findField('/qDimensionInfo/0').title()).to.equal('A');
    });

    it('should find a measure field', () => {
      expect(q.findField('/qMeasureInfo/0').title()).to.equal('C');
    });

    it('should find a dimension field by title', () => {
      expect(q.findField('A').title()).to.equal('A');
    });

    it('should find a measure field by title', () => {
      expect(q.findField('C').title()).to.equal('C');
    });

    it('should return undefined when field can not be found', () => {
      expect(q.findField('asd')).to.equal(undefined);
    });

    it('should have proper data sent to a field', () => {
      expect(q.findField('C').data()).to.eql({
        meta: { qFallbackTitle: 'C' },
        pages: [{ qMatrix: [] }],
        idx: 2,
        localeInfo: 'locale specific stuff'
      });
    });
  });

  describe('hypercube with attribute expressions on dimension', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [
            {
              qFallbackTitle: 'A',
              qAttrExprInfo: [{
                id: 'yes',
                qFallbackTitle: 'wohoo'
              }]
            },
            { qFallbackTitle: 'B' }
          ],
          qMeasureInfo: [{ qFallbackTitle: 'C' }],
          qDataPages: [{ qMatrix: [] }]
        },
        localeInfo: 'locale stuff'
      });
    });

    it('should find an attribute expression field', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrExprInfo/0').title()).to.equal('wohoo');
    });

    it('should have proper data', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrExprInfo/0').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'wohoo' },
        pages: [{ qMatrix: [] }],
        idx: 0,
        attrIdx: 0,
        localeInfo: 'locale stuff'
      });
    });
  });

  describe('hypercube with attribute expressions on measure', () => {
    let q;
    beforeEach(() => {
      q = qTable()({ cube: {
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: [
          { qFallbackTitle: 'A' },
          { qFallbackTitle: 'B' }
        ],
        qMeasureInfo: [
          {},
          {},
          {
            qFallbackTitle: 'C',
            qAttrExprInfo: [{}, {
              id: 'yes',
              qFallbackTitle: 'wohoo'
            }]
          }],
        qDataPages: [{ qMatrix: [] }]
      } });
    });

    it('should find an attribute expression field', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrExprInfo/1').title()).to.equal('wohoo');
    });

    it('should have proper data', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrExprInfo/1').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'wohoo' },
        pages: [{ qMatrix: [] }],
        idx: 4,
        attrIdx: 1,
        localeInfo: undefined
      });
    });
  });

  describe('stackedobject', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
          qMeasureInfo: [{ qFallbackTitle: 'C' }],
          qMode: 'K',
          qEffectiveInterColumnSortOrder: [1, 0],
          qStackedDataPages: [{ qData: [
            {
              qType: 'R',
              qElemNo: 0,
              qSubNodes: [
                {
                  qText: 'Alpha',
                  qElemNo: 1,
                  qValue: 'NaN'
                },
                {
                  qText: 'Beta',
                  qElemNo: 3,
                  qValue: 2
                }
              ]
            }
          ] }]
        },
        localeInfo: 'locale specific stuff'
      });
    });

    it('should have 3 fields', () => {
      expect(q.fields().length).to.equal(3);
    });

    it('should find a dimension field', () => {
      expect(q.findField('/qDimensionInfo/0').title()).to.equal('A');
    });

    it('should find a measure field', () => {
      expect(q.findField('/qMeasureInfo/0').title()).to.equal('C');
    });

    it('should should have locale data', () => {
      expect(q.findField('/qMeasureInfo/0').data().localeInfo).to.eql('locale specific stuff');
    });

    it('should find a dimension field by title', () => {
      expect(q.findField('A').title()).to.equal('A');
    });

    it('should find a measure field by title', () => {
      expect(q.findField('C').title()).to.equal('C');
    });

    it('should return undefined when field can not be found', () => {
      expect(q.findField('asd')).to.equal(undefined);
    });

    it('should have values', () => {
      // expect(q.findField('B').values()).to.eql([
      //   { value: 'NaN', label: 'Alpha', id: 1 },
      //   { value: 2, label: 'Beta', id: 3 }
      // ]);

      expect(q.findField('/qDimensionInfo/1').values()).to.eql([
        { value: 'NaN', label: 'Alpha', id: 1, index: 0 },
        { value: 2, label: 'Beta', id: 3, index: 1 }
      ]);
    });
  });

  describe('listobject', () => {
    let q;
    beforeEach(() => {
      q = qTable()({ cube: {
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: { qFallbackTitle: 'A' },
        qDataPages: [{ qArea: { qTop: 0, qLeft: 0, qHeight: 20, qWidth: 1 },
          qMatrix: [
            [{ qNum: 17, qText: 'alpha', qElemNumber: 3 }],
            [{ qNum: 'NaN', qText: 'beta', qElemNumber: 4 }],
            [{ qNum: null, qText: 'gamma', qElemNumber: 5 }]
          ] }]
      } });
    });
    it('should have 1 fields', () => {
      expect(q.fields().length).to.equal(1);
    });

    it('should find a dimension field', () => {
      expect(q.findField('/qDimensionInfo').title()).to.equal('A');
    });

    it('should find a dimension field by title', () => {
      expect(q.findField('A').title()).to.equal('A');
    });

    it('should have values', () => {
      expect(q.findField('A').values()).to.eql([
        { value: 17, label: 'alpha', id: 3, index: 0 },
        { value: 'NaN', label: 'beta', id: 4, index: 1 },
        { value: null, label: 'gamma', id: 5, index: 2 }
      ]);
    });
  });
});
