import qField from '../../../../src/q/data/q-field';

describe('QField', () => {
  let f;
  const page = {
    qArea: { qLeft: 0, qTop: 0, qWidth: 2, qHeight: 3 },
    qMatrix: [
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }],
      [{}, { qNum: 7, qText: 'sju', qElemNumber: 2 }],
      [{}, { qNum: 1, qText: 'ett', qElemNumber: 3 }]
    ]
  };

  const page2 = {
    qArea: { qLeft: 7, qTop: 0, qWidth: 2, qHeight: 3 },
    qMatrix: [
      [{}, { qNum: 2, qText: 'två', qElemNumber: 1 }],
      [{}, { qNum: 6, qText: 'sex', qElemNumber: 2 }],
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 3 }]
    ]
  };

  describe('', () => {
    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'wohoo',
        qStateCounts: {}
      },
      pages: [page, page2],
      idx: 1
    };
    beforeEach(() => {
      f = qField()(dd);
    });

    it('should return min value', () => {
      expect(f.min()).to.equal(1);
    });

    it('should return max value', () => {
      expect(f.max()).to.equal(2);
    });

    it('should return tags', () => {
      expect(f.tags()).to.deep.equal(['a', 'b']);
    });

    it('should return title', () => {
      expect(f.title()).to.equal('wohoo');
    });

    it('should identify when the field is a dimension', () => {
      expect(f.type()).to.equal('dimension');
    });

    it('should identify when the field is a measure', () => {
      const m = qField()({ meta: {} });
      expect(m.type()).to.equal('measure');
    });

    it('should return values', () => {
      const values = f.values();
      expect(values).to.deep.equal([
        { value: 3, label: 'tre', id: 1 },
        { value: 7, label: 'sju', id: 2 },
        { value: 1, label: 'ett', id: 3 }
      ]);
    });
  });

  describe('with offset pages', () => {
    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'wohoo'
      },
      pages: [page, page2],
      idx: 8
    };
    beforeEach(() => {
      f = qField()(dd);
    });

    it('should return values', () => {
      const values = f.values();
      expect(values).to.deep.equal([
        { value: 2, label: 'två', id: 1 },
        { value: 6, label: 'sex', id: 2 },
        { value: 3, label: 'tre', id: 3 }
      ]);
    });
  });
});
