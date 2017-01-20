import qTable from '../../../../src/q/data/q-table';

describe('qTable', () => {
  describe('hypercube', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
        qMeasureInfo: [{ qFallbackTitle: 'C' }],
        qDataPages: [{ qMatrix: [] }]
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
  });

  describe('stackedobject', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
        qMeasureInfo: [{ qFallbackTitle: 'C' }],
        qMode: 'K',
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
      expect(q.findField('A').values()).to.eql([
        { value: 'NaN', label: 'Alpha', id: 1 },
        { value: 2, label: 'Beta', id: 3 }
      ]);
    });
  });

  describe('listobject', () => {
    let q;
    beforeEach(() => {
      q = qTable()({
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: { qFallbackTitle: 'A' },
        qDataPages: [{ qArea: { qTop: 0, qLeft: 0, qHeight: 20, qWidth: 1 },
          qMatrix: [
            [{ qNum: 17, qText: 'alpha', qElemNumber: 3 }],
            [{ qNum: 'NaN', qText: 'beta', qElemNumber: 4 }],
            [{ qNum: null, qText: 'gamma', qElemNumber: 5 }]
          ] }]
      });
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
        { value: 17, label: 'alpha', id: 3 },
        { value: 'NaN', label: 'beta', id: 4 },
        { value: null, label: 'gamma', id: 5 }
      ]);
    });
  });
});
