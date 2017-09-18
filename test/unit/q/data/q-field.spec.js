import * as picasso from '../../../../src/index';

import initPlugin, { qField } from '../../../../plugins/q/src/q';

describe('QField', () => {
  let f;

  const page = {
    qArea: { qLeft: 0, qTop: 5, qWidth: 2, qHeight: 3 },
    qMatrix: [
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }],
      [{}, { qNum: 7, qText: 'sju', qElemNumber: 2 }],
      [{}, { qNum: 1, qText: 'ett', qElemNumber: 3 }]
    ]
  };

  const page2 = {
    qArea: { qLeft: 7, qTop: 25, qWidth: 2, qHeight: 3 },
    qMatrix: [
      [{}, { qNum: 2, qText: 'två', qElemNumber: 1 }],
      [{}, { qNum: 6, qText: 'sex', qElemNumber: 2 }],
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 3 }]
    ]
  };

  beforeEach(() => {
    initPlugin(picasso);
  });

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
      f = qField(dd);
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
      const m = qField({ meta: {} });
      expect(m.type()).to.equal('measure');
    });

    it('should return values', () => {
      const values = f.values();
      expect(values).to.deep.equal([
        { value: 3, label: 'tre', id: 1, index: 5 },
        { value: 7, label: 'sju', id: 2, index: 6 },
        { value: 1, label: 'ett', id: 3, index: 7 }
      ]);
    });
  });

  describe('others', () => {
    const pageWithOtherNodes = {
      qArea: { qLeft: 0, qTop: 1, qWidth: 2, qHeight: 3 },
      qMatrix: [
        [{}, { qNum: 2, qElemNumber: -3 }],
        [{}, { qNum: 4, qText: 'fyra', qElemNumber: 2 }],
        [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }]
      ]
    };
    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'wohoo'
      },
      pages: [pageWithOtherNodes],
      idx: 1
    };

    it('should fallback to empty string when othersLabel is not defined', () => {
      const ff = qField(dd);
      const values = ff.values();
      expect(values).to.eql([
        { value: 2, label: '', id: -3, index: 1 },
        { value: 4, label: 'fyra', id: 2, index: 2 },
        { value: 3, label: 'tre', id: 1, index: 3 }
      ]);
    });

    it('should use the defined othersLabel', () => {
      const ff = qField({
        meta: {
          qMin: 1,
          qMax: 2,
          qTags: ['a', 'b'],
          qFallbackTitle: 'wohoo',
          othersLabel: 'dom andra'
        },
        pages: [pageWithOtherNodes],
        idx: 1
      });
      const values = ff.values();
      expect(values).to.eql([
        { value: 2, label: 'dom andra', id: -3, index: 1 },
        { value: 4, label: 'fyra', id: 2, index: 2 },
        { value: 3, label: 'tre', id: 1, index: 3 }
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
      f = qField(dd);
    });

    it('should return values', () => {
      const values = f.values();
      expect(values).to.deep.equal([
        { value: 2, label: 'två', id: 1, index: 25 },
        { value: 6, label: 'sex', id: 2, index: 26 },
        { value: 3, label: 'tre', id: 3, index: 27 }
      ]);
    });
  });

  describe('with stacked data', () => {
    describe('containing two dimensions, one measure', () => {
      const stackedPageWithoutPseudo = {
        qArea: {
          qLeft: 0,
          qTop: 0,
          qWidth: 2,
          qHeight: 3
        },
        qData: [
          {
            qType: 'R',
            qElemNo: 0,
            qSubNodes: [
              {
                qText: 'Alpha',
                qElemNo: 1,
                qRow: 7,
                qValue: 'NaN',
                qSubNodes: [
                  { qText: '$666', qElemNo: -1, qValue: 666, qType: 'T' },
                  { qText: 'a1', qElemNo: 0, qRow: 8, qValue: 123, qSubNodes: [{ qValue: 45, qElemNo: 0, qRow: 8, qText: '$45.00', qAttrExps: { qValues: [{}, { qText: 'redish', qNum: 'NaN' }] } }] },
                  { qText: 'a2', qElemNo: 3, qRow: 9, qValue: 135, qSubNodes: [{ qValue: 32, qElemNo: 0, qRow: 9, qText: '$32.00', qAttrExps: { qValues: [{}, { qText: 'white', qNum: false }] } }] }
                ] },
              {
                qText: 'Beta',
                qElemNo: 3,
                qRow: 10,
                qValue: 2,
                qSubNodes: [
                  { qText: '$666', qElemNo: -1, qRow: 11, qValue: 666, qType: 'T' },
                  { qText: 'b1', qElemNo: 7, qRow: 12, qValue: 345, qSubNodes: [{ qValue: 13, qElemNo: 0, qRow: 12, qText: '$13.00', qAttrExps: { qValues: [{}, { qText: 'red', qNum: 987 }] } }] },
                  { qText: 'b3', qElemNo: 9, qRow: 13, qValue: 276, qSubNodes: [{ qValue: 17, qElemNo: 0, qRow: 13, qText: '$17.00', qAttrExps: { qValues: [{}, { qText: 'green', qNum: 'NaN' }] } }] }
                ]
              }
            ]
          }
        ]
      };

      it('should extract values from first dimension', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithoutPseudo],
          idx: 0
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { value: 'NaN', label: 'Alpha', id: 1, index: 7 },
          { value: 'NaN', label: 'Alpha', id: 1, index: 7 },
          { value: 2, label: 'Beta', id: 3, index: 10 },
          { value: 2, label: 'Beta', id: 3, index: 10 }
        ]);
      });

      it('should extract values from second dimension', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithoutPseudo],
          idx: 1
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: 'a1', id: 0, value: 123, index: 8 },
          { label: 'a2', id: 3, value: 135, index: 9 },
          { label: 'b1', id: 7, value: 345, index: 12 },
          { label: 'b3', id: 9, value: 276, index: 13 }
        ]);
      });

      it('should extract values from measure', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithoutPseudo],
          idx: 2
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: '$45.00', id: 0, value: 45, index: 8 },
          { label: '$32.00', id: 0, value: 32, index: 9 },
          { label: '$13.00', id: 0, value: 13, index: 12 },
          { label: '$17.00', id: 0, value: 17, index: 13 }
        ]);
      });

      it('should extract values from attribute expression on measure', () => {
        const dd = {
          meta: {
            qMin: 'NaN',
            qMax: 'NaN',
            qFallbackTitle: 'attr express'
          },
          pages: [stackedPageWithoutPseudo],
          idx: 2,
          attrIdx: 1
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { value: 'NaN', label: 'redish', id: 0, index: 0 },
          { value: false, label: 'white', id: 0, index: 1 },
          { value: 987, label: 'red', id: 0, index: 2 },
          { value: 'NaN', label: 'green', id: 0, index: 3 }
        ]);
      });
    });

    describe('containing two dimensions, two measures (pseudo dim)', () => {
      const stackedPageWithPseudo = {
        qArea: {
          qLeft: 0,
          qTop: 8,
          qWidth: 2,
          qHeight: 3
        },
        qData: [
          {
            qType: 'R',
            qElemNo: 0,
            qSubNodes: [
              {
                qText: 'Alpha',
                qElemNo: 1,
                qRow: 13,
                qValue: 'NaN',
                qAttrDims: { qValues: [{}, { qText: 'alpha attr dim', qElemNo: 333 }] },
                qAttrExps: { qValues: [{}, { qNum: 255 }] },
                qSubNodes: [
                  {
                    qText: 'Margin',
                    qElemNo: 0,
                    qRow: 13,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'a1', qValue: 'NaN', qElemNo: 3, qRow: 13, qSubNodes: [{ qValue: 0.50, qElemNo: 0, qRow: 13, qText: '50%' }] },
                      { qText: 'a2', qValue: 2014, qElemNo: 4, qRow: 14, qSubNodes: [{ qValue: 0.51, qElemNo: 0, qRow: 14, qText: '51%' }] },
                      { qText: 'a3', qValue: 'NaN', qElemNo: 5, qRow: 15, qSubNodes: [{ qValue: 0.52, qElemNo: 0, qRow: 15, qText: '52%' }] }
                    ]
                  },
                  {
                    qText: 'Sales',
                    qElemNo: 1,
                    qRow: 16,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'a1', qValue: 'NaN', qElemNo: 3, qRow: 16, qSubNodes: [{ qValue: 41, qElemNo: 0, qRow: 16, qText: '$41' }] },
                      { qText: 'a2', qValue: 'NaN', qElemNo: 4, qRow: 17, qSubNodes: [{ qValue: 42, qElemNo: 0, qRow: 17, qText: '$42' }] },
                      { qText: 'a3', qValue: 'NaN', qElemNo: 5, qRow: 18, qSubNodes: [{ qValue: 43, qElemNo: 0, qRow: 18, qText: '$43' }] }
                    ]
                  }
                ]
              },
              {
                qText: 'Beta',
                qElemNo: 3,
                qRow: 19,
                qValue: 2,
                qAttrDims: { qValues: [{}, { qText: 'beta attr dim', qElemNo: 334 }] },
                qAttrExps: { qValues: [{}, { qNum: 311 }] },
                qSubNodes: [
                  {
                    qText: 'Margin',
                    qElemNo: 0,
                    qRow: 19,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'b1', qValue: 'NaN', qElemNo: 7, qRow: 19, qSubNodes: [{ qValue: 0.60, qElemNo: 0, qRow: 19, qText: '60%' }] },
                      { qText: 'b2', qValue: 'NaN', qElemNo: 8, qRow: 20, qSubNodes: [{ qValue: 0.62, qElemNo: 0, qRow: 20, qText: '62%' }] }
                    ]
                  },
                  {
                    qText: 'Sales',
                    qElemNo: 1,
                    qRow: 21,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'b1', qValue: 'NaN', qElemNo: 7, qRow: 21, qSubNodes: [{ qValue: 71, qElemNo: 0, qRow: 21, qText: '$71' }] },
                      { qText: 'b2', qValue: 'NaN', qElemNo: 8, qRow: 22, qSubNodes: [{ qValue: 72, qElemNo: 0, qRow: 22, qText: '$72' }] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      it('should extract values from first dimension', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithPseudo],
          idx: 0
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: 'Alpha', id: 1, value: 'NaN', index: 13 },
          { label: 'Alpha', id: 1, value: 'NaN', index: 13 },
          { label: 'Alpha', id: 1, value: 'NaN', index: 13 },
          { label: 'Beta', id: 3, value: 2, index: 19 },
          { label: 'Beta', id: 3, value: 2, index: 19 }
        ]);
      });

      it('should extract values from second dimension', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithPseudo],
          idx: 1
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: 'a1', id: 3, value: 'NaN', index: 13 },
          { label: 'a2', id: 4, value: 2014, index: 14 },
          { label: 'a3', id: 5, value: 'NaN', index: 15 },
          { label: 'b1', id: 7, value: 'NaN', index: 19 },
          { label: 'b2', id: 8, value: 'NaN', index: 20 }
        ]);
      });

      it('should extract attribute dimension values from first dimension', () => {
        const dd = {
          meta: {
            qSize: {},
            qFallbackTitle: 'attr express'
          },
          pages: [stackedPageWithPseudo],
          idx: 0,
          attrDimIdx: 1
        };

        let ff = qField(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: 'alpha attr dim', id: 333, value: undefined, index: 0 },
          { label: 'alpha attr dim', id: 333, value: undefined, index: 1 },
          { label: 'alpha attr dim', id: 333, value: undefined, index: 2 },
          { label: 'beta attr dim', id: 334, value: undefined, index: 3 },
          { label: 'beta attr dim', id: 334, value: undefined, index: 4 }
        ]);
      });

      it('should extract attribute expression values from first dimension', () => {
        const dd = {
          meta: {
            qMin: 456,
            qMax: 678,
            qFallbackTitle: 'attr express'
          },
          pages: [stackedPageWithPseudo],
          idx: 0,
          attrIdx: 1
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: '', id: 0, value: 255, index: 0 },
          { label: '', id: 0, value: 255, index: 1 },
          { label: '', id: 0, value: 255, index: 2 },
          { label: '', id: 0, value: 311, index: 3 },
          { label: '', id: 0, value: 311, index: 4 }
        ]);
      });

      it('should extract values from first measure', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithPseudo],
          idx: 2
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: '50%', id: 0, value: 0.50, index: 13 },
          { label: '51%', id: 0, value: 0.51, index: 14 },
          { label: '52%', id: 0, value: 0.52, index: 15 },
          { label: '60%', id: 0, value: 0.60, index: 19 },
          { label: '62%', id: 0, value: 0.62, index: 20 }
        ]);
      });

      it('should extract values from second measure', () => {
        const dd = {
          meta: {
            qMin: 1,
            qMax: 2,
            qTags: ['a', 'b'],
            qStateCounts: {},
            qFallbackTitle: 'wohoo'
          },
          pages: [stackedPageWithPseudo],
          idx: 3
        };

        const ff = qField(dd);
        const values = ff.values();
        expect(values).to.deep.equal([
          { label: '$41', id: 0, value: 41, index: 16 },
          { label: '$42', id: 0, value: 42, index: 17 },
          { label: '$43', id: 0, value: 43, index: 18 },
          { label: '$71', id: 0, value: 71, index: 21 },
          { label: '$72', id: 0, value: 72, index: 22 }
        ]);
      });
    });
  });

  describe('as attribute expression', () => {
    const pageWithAttrExpr = {
      qArea: { qLeft: 7, qTop: 0, qWidth: 2, qHeight: 3 },
      qMatrix: [
        [{}, { qNum: 2, qText: 'två', qElemNumber: 1, qAttrExps: { qValues: [{ qNum: 13, qText: 'tretton' }, { qText: 'red' }] } }],
        [{}, { qNum: 6, qText: 'sex', qElemNumber: 2, qAttrExps: { qValues: [{ qNum: 15, qText: 'femton' }, { qText: 'green' }] } }],
        [{}, { qNum: 3, qText: 'tre', qElemNumber: 3, qAttrExps: { qValues: [{ qNum: 12, qText: 'tolv' }, { qText: 'blue' }] } }]
      ]
    };

    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qFallbackTitle: 'wohoo'
      },
      pages: [pageWithAttrExpr],
      idx: 8,
      attrIdx: 0
    };

    it('should extract the proper values', () => {
      const ff = qField(dd);

      expect(ff.values()).to.eql([
        { value: 13, label: 'tretton', id: 0, index: 0 },
        { value: 15, label: 'femton', id: 0, index: 1 },
        { value: 12, label: 'tolv', id: 0, index: 2 }
      ]);
    });
  });

  describe('as attribute dimension', () => {
    const pageWithAttrDim = {
      qArea: { qLeft: 7, qTop: 0, qWidth: 2, qHeight: 3 },
      qMatrix: [
        [{}, { qNum: 2, qText: 'två', qElemNumber: 1, qAttrDims: { qValues: [{ qText: 'a' }, { qText: 'tretton', qElemNo: 7 }] } }],
        [{}, { qNum: 6, qText: 'sex', qElemNumber: 2, qAttrDims: { qValues: [{ qText: 'b' }, { qElemNo: -2 }] } }],
        [{}, { qNum: 3, qText: 'tre', qElemNumber: 3, qAttrDims: { qValues: [{ qText: 'c' }, { qText: 'tolv', qElemNo: 6 }] } }]
      ]
    };

    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qFallbackTitle: 'wohoo'
      },
      pages: [pageWithAttrDim],
      idx: 8,
      attrDimIdx: 1
    };

    it('should extract attribute dimension values', () => {
      const ff = qField(dd);

      expect(ff.values()).to.eql([
        { value: undefined, label: 'tretton', id: 7, index: 0 },
        { value: undefined, label: '-', id: -2, index: 1 },
        { value: undefined, label: 'tolv', id: 6, index: 2 }
      ]);
    });
  });
});
