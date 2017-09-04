// import * as picasso from '../../../../src/index';

import qField from '../../src/data/field';

describe('q-field', () => {
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

  // beforeEach(() => {
  //   initPlugin(picasso);
  // });

  describe('meta', () => {
    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'wohoo',
        qStateCounts: {}
      },
      cube: { qMode: 'S' },
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
      const values = f.items();
      expect(values).to.deep.equal([
        { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
        { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 },
        { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }
      ]);
    });

    it('should have a formatter', () => {
      const form = f.formatter;
      expect(typeof form).to.eql('function');
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
      cube: { qMode: 'S' },
      pages: [pageWithOtherNodes],
      idx: 1
    };

    it('should fallback to empty string when othersLabel is not defined', () => {
      const ff = qField(dd);
      const values = ff.items();
      expect(values).to.eql([
        { qNum: 2, qText: '', qElemNumber: -3, qRow: 1 },
        { qNum: 4, qText: 'fyra', qElemNumber: 2, qRow: 2 },
        { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 3 }
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
        cube: { qMode: 'S' },
        pages: [pageWithOtherNodes],
        idx: 1
      });
      const values = ff.items();
      expect(values).to.eql([
        { qNum: 2, qText: 'dom andra', qElemNumber: -3, qRow: 1 },
        { qNum: 4, qText: 'fyra', qElemNumber: 2, qRow: 2 },
        { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 3 }
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
      cube: { qMode: 'S' },
      pages: [page, page2],
      idx: 8
    };
    beforeEach(() => {
      f = qField(dd);
    });

    it('should return values', () => {
      const values = f.items();
      expect(values).to.deep.equal([
        { qNum: 2, qText: 'två', qElemNumber: 1, qRow: 25 },
        { qNum: 6, qText: 'sex', qElemNumber: 2, qRow: 26 },
        { qNum: 3, qText: 'tre', qElemNumber: 3, qRow: 27 }
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
          cube: { qMode: 'K', qDimensionInfo: [{}, {}], qMeasureInfo: [{}] },
          pages: [stackedPageWithoutPseudo],
          idx: 0
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qValue: 'NaN', qText: 'Alpha', qElemNo: 1, qRow: 7, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes },
          { qValue: 2, qText: 'Beta', qElemNo: 3, qRow: 10, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes }
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
          cube: { qMode: 'K', qDimensionInfo: [{}, {}], qMeasureInfo: [{}] },
          pages: [stackedPageWithoutPseudo],
          idx: 1
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qText: 'a1', qElemNo: 0, qValue: 123, qRow: 8, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[1].qSubNodes },
          { qText: 'a2', qElemNo: 3, qValue: 135, qRow: 9, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[2].qSubNodes },
          { qText: 'b1', qElemNo: 7, qValue: 345, qRow: 12, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[1].qSubNodes },
          { qText: 'b3', qElemNo: 9, qValue: 276, qRow: 13, qSubNodes: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[2].qSubNodes }
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
          cube: { qMode: 'K', qDimensionInfo: [{}, {}], qMeasureInfo: [{}] },
          pages: [stackedPageWithoutPseudo],
          idx: 2
        };

        const ff = qField(dd);
        const values = ff.items();
        const expected = [
          stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[1].qSubNodes[0],
          stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[2].qSubNodes[0],
          stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[1].qSubNodes[0],
          stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[2].qSubNodes[0]
        ];
        expect(values).to.deep.equal(expected);
      });

      it('should extract values from attribute expression on measure', () => {
        const dd = {
          meta: {
            qMin: 'NaN',
            qMax: 'NaN',
            qFallbackTitle: 'attr express'
          },
          cube: { qMode: 'K', qDimensionInfo: [{}, {}], qMeasureInfo: [{}] },
          pages: [stackedPageWithoutPseudo],
          idx: 2,
          attrIdx: 1
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qNum: 'NaN', qText: 'redish' },
          { qNum: false, qText: 'white' },
          { qNum: 987, qText: 'red' },
          { qNum: 'NaN', qText: 'green' }
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

      const cube = {
        qMode: 'K',
        qDimensionInfo: [{}, {}],
        qMeasureInfo: [{}, {}],
        qEffectiveInterColumnSortOrder: [0, -1, 1]
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
          cube,
          pages: [stackedPageWithPseudo],
          idx: 0
        };

        const ff = qField(dd);
        const values = ff.items();
        const expected = [
          stackedPageWithPseudo.qData[0].qSubNodes[0],
          stackedPageWithPseudo.qData[0].qSubNodes[1]
        ];
        expect(values).to.deep.equal(expected);
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
          cube,
          pages: [stackedPageWithPseudo],
          idx: 1
        };

        const ff = qField(dd);
        const values = ff.items();
        const expected = [
          { qText: 'a1', qValue: 'NaN', qElemNo: 3, qRow: 13, qSubNodes: [{ qValue: 0.50, qElemNo: 0, qRow: 13, qText: '50%' }] },
          { qText: 'a2', qValue: 2014, qElemNo: 4, qRow: 14, qSubNodes: [{ qValue: 0.51, qElemNo: 0, qRow: 14, qText: '51%' }] },
          { qText: 'a3', qValue: 'NaN', qElemNo: 5, qRow: 15, qSubNodes: [{ qValue: 0.52, qElemNo: 0, qRow: 15, qText: '52%' }] },
          { qText: 'a1', qValue: 'NaN', qElemNo: 3, qRow: 16, qSubNodes: [{ qValue: 41, qElemNo: 0, qRow: 16, qText: '$41' }] },
          { qText: 'a2', qValue: 'NaN', qElemNo: 4, qRow: 17, qSubNodes: [{ qValue: 42, qElemNo: 0, qRow: 17, qText: '$42' }] },
          { qText: 'a3', qValue: 'NaN', qElemNo: 5, qRow: 18, qSubNodes: [{ qValue: 43, qElemNo: 0, qRow: 18, qText: '$43' }] },
          { qText: 'b1', qValue: 'NaN', qElemNo: 7, qRow: 19, qSubNodes: [{ qValue: 0.60, qElemNo: 0, qRow: 19, qText: '60%' }] },
          { qText: 'b2', qValue: 'NaN', qElemNo: 8, qRow: 20, qSubNodes: [{ qValue: 0.62, qElemNo: 0, qRow: 20, qText: '62%' }] },
          { qText: 'b1', qValue: 'NaN', qElemNo: 7, qRow: 21, qSubNodes: [{ qValue: 71, qElemNo: 0, qRow: 21, qText: '$71' }] },
          { qText: 'b2', qValue: 'NaN', qElemNo: 8, qRow: 22, qSubNodes: [{ qValue: 72, qElemNo: 0, qRow: 22, qText: '$72' }] }
        ];
        expect(values).to.deep.equal(expected);
      });

      it('should extract attribute dimension values from first dimension', () => {
        const dd = {
          meta: {
            qSize: {},
            qFallbackTitle: 'attr express'
          },
          cube,
          pages: [stackedPageWithPseudo],
          idx: 0,
          attrDimIdx: 1
        };

        let ff = qField(dd);
        let values = ff.items();
        expect(values).to.deep.equal([
          { qText: 'alpha attr dim', qElemNo: 333 },
          { qText: 'beta attr dim', qElemNo: 334 }
        ]);
      });

      it('should extract attribute expression values from first dimension', () => {
        const dd = {
          meta: {
            qMin: 456,
            qMax: 678,
            qFallbackTitle: 'attr express'
          },
          cube,
          pages: [stackedPageWithPseudo],
          idx: 0,
          attrIdx: 1
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qNum: 255 },
          { qNum: 311 }
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
          cube,
          pages: [stackedPageWithPseudo],
          idx: 2
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qText: '50%', qElemNo: 0, qValue: 0.50, qRow: 13 },
          { qText: '51%', qElemNo: 0, qValue: 0.51, qRow: 14 },
          { qText: '52%', qElemNo: 0, qValue: 0.52, qRow: 15 },
          { qText: '60%', qElemNo: 0, qValue: 0.60, qRow: 19 },
          { qText: '62%', qElemNo: 0, qValue: 0.62, qRow: 20 }
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
          cube,
          pages: [stackedPageWithPseudo],
          idx: 3
        };

        const ff = qField(dd);
        const values = ff.items();
        expect(values).to.deep.equal([
          { qText: '$41', qElemNo: 0, qValue: 41, qRow: 16 },
          { qText: '$42', qElemNo: 0, qValue: 42, qRow: 17 },
          { qText: '$43', qElemNo: 0, qValue: 43, qRow: 18 },
          { qText: '$71', qElemNo: 0, qValue: 71, qRow: 21 },
          { qText: '$72', qElemNo: 0, qValue: 72, qRow: 22 }
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
      cube: {
        qMode: 'S'
      },
      pages: [pageWithAttrExpr],
      idx: 8,
      attrIdx: 0
    };

    it('should extract the proper values', () => {
      const ff = qField(dd);

      expect(ff.items()).to.eql([
        { qNum: 13, qText: 'tretton', qRow: 0 },
        { qNum: 15, qText: 'femton', qRow: 1 },
        { qNum: 12, qText: 'tolv', qRow: 2 }
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
      cube: {
        qMode: 'S'
      },
      pages: [pageWithAttrDim],
      idx: 8,
      attrDimIdx: 1
    };

    it('should extract attribute dimension values', () => {
      const ff = qField(dd);

      expect(ff.items()).to.eql([
        { qText: 'tretton', qElemNo: 7, qRow: 0 },
        { qText: 'femton', qElemNo: -2, qRow: 1 },
        { qText: 'tolv', qElemNo: 6, qRow: 2 }
      ]);
    });
  });
});
