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

  describe('others', () => {
    const pageWithOtherNodes = {
      qArea: { qLeft: 0, qTop: 0, qWidth: 2, qHeight: 3 },
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
      let ff = qField()(dd);
      let values = ff.values();
      expect(values).to.eql([
        { value: 2, label: '', id: -3 },
        { value: 4, label: 'fyra', id: 2 },
        { value: 3, label: 'tre', id: 1 }
      ]);
    });

    it('should use the defined othersLabel', () => {
      let ff = qField()({
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
      let values = ff.values();
      expect(values).to.eql([
        { value: 2, label: 'dom andra', id: -3 },
        { value: 4, label: 'fyra', id: 2 },
        { value: 3, label: 'tre', id: 1 }
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
                qValue: 'NaN',
                qSubNodes: [
                  { qText: '$666', qElemNo: -1, qValue: 666, qType: 'T' },
                  { qText: 'a1', qElemNo: 0, qValue: 123, qSubNodes: [{ qValue: 45, qElemNo: 0, qText: '$45.00', qAttrExps: { qValues: [{}, { qText: 'redish', qNum: 'NaN' }] } }] },
                  { qText: 'a2', qElemNo: 3, qValue: 135, qSubNodes: [{ qValue: 32, qElemNo: 0, qText: '$32.00', qAttrExps: { qValues: [{}, { qText: 'white', qNum: false }] } }] }
                ] },
              {
                qText: 'Beta',
                qElemNo: 3,
                qValue: 2,
                qSubNodes: [
                  { qText: '$666', qElemNo: -1, qValue: 666, qType: 'T' },
                  { qText: 'b1', qElemNo: 7, qValue: 345, qSubNodes: [{ qValue: 13, qElemNo: 0, qText: '$13.00', qAttrExps: { qValues: [{}, { qText: 'red', qNum: 987 }] } }] },
                  { qText: 'b3', qElemNo: 9, qValue: 276, qSubNodes: [{ qValue: 17, qElemNo: 0, qText: '$17.00', qAttrExps: { qValues: [{}, { qText: 'green', qNum: 'NaN' }] } }] }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { value: 'NaN', label: 'Alpha', id: 1 },
          { value: 'NaN', label: 'Alpha', id: 1 },
          { value: 2, label: 'Beta', id: 3 },
          { value: 2, label: 'Beta', id: 3 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: 'a1', id: 0, value: 123 },
          { label: 'a2', id: 3, value: 135 },
          { label: 'b1', id: 7, value: 345 },
          { label: 'b3', id: 9, value: 276 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: '$45.00', id: 0, value: 45 },
          { label: '$32.00', id: 0, value: 32 },
          { label: '$13.00', id: 0, value: 13 },
          { label: '$17.00', id: 0, value: 17 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { value: 'NaN', label: 'redish', id: 0 },
          { value: false, label: 'white', id: 0 },
          { value: 987, label: 'red', id: 0 },
          { value: 'NaN', label: 'green', id: 0 }
        ]);
      });
    });

    describe('containing two dimensions, two measures (pseudo dim)', () => {
      const stackedPageWithPseudo = {
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
                qValue: 'NaN',
                qAttrExps: { qValues: [{}, { qNum: 255 }] },
                qSubNodes: [
                  {
                    qText: 'Margin',
                    qElemNo: 0,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'a1', qValue: 'NaN', qElemNo: 3, qSubNodes: [{ qValue: 0.50, qElemNo: 0, qText: '50%' }] },
                      { qText: 'a2', qValue: 2014, qElemNo: 4, qSubNodes: [{ qValue: 0.51, qElemNo: 0, qText: '51%' }] },
                      { qText: 'a3', qValue: 'NaN', qElemNo: 5, qSubNodes: [{ qValue: 0.52, qElemNo: 0, qText: '52%' }] }
                    ]
                  },
                  {
                    qText: 'Sales',
                    qElemNo: 1,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'a1', qValue: 'NaN', qElemNo: 3, qSubNodes: [{ qValue: 41, qElemNo: 0, qText: '$41' }] },
                      { qText: 'a2', qValue: 'NaN', qElemNo: 4, qSubNodes: [{ qValue: 42, qElemNo: 0, qText: '$42' }] },
                      { qText: 'a3', qValue: 'NaN', qElemNo: 5, qSubNodes: [{ qValue: 43, qElemNo: 0, qText: '$43' }] }
                    ]
                  }
                ]
              },
              {
                qText: 'Beta',
                qElemNo: 3,
                qValue: 2,
                qAttrExps: { qValues: [{}, { qNum: 311 }] },
                qSubNodes: [
                  {
                    qText: 'Margin',
                    qElemNo: 0,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'b1', qValue: 'NaN', qElemNo: 7, qSubNodes: [{ qValue: 0.60, qElemNo: 0, qText: '60%' }] },
                      { qText: 'b2', qValue: 'NaN', qElemNo: 8, qSubNodes: [{ qValue: 0.62, qElemNo: 0, qText: '62%' }] }
                    ]
                  },
                  {
                    qText: 'Sales',
                    qElemNo: 1,
                    qValue: 'NaN',
                    qType: 'P',
                    qSubNodes: [
                      { qText: 'b1', qValue: 'NaN', qElemNo: 7, qSubNodes: [{ qValue: 71, qElemNo: 0, qText: '$71' }] },
                      { qText: 'b2', qValue: 'NaN', qElemNo: 8, qSubNodes: [{ qValue: 72, qElemNo: 0, qText: '$72' }] }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: 'Alpha', id: 1, value: 'NaN' },
          { label: 'Alpha', id: 1, value: 'NaN' },
          { label: 'Alpha', id: 1, value: 'NaN' },
          { label: 'Beta', id: 3, value: 2 },
          { label: 'Beta', id: 3, value: 2 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: 'a1', id: 3, value: 'NaN' },
          { label: 'a2', id: 4, value: 2014 },
          { label: 'a3', id: 5, value: 'NaN' },
          { label: 'b1', id: 7, value: 'NaN' },
          { label: 'b2', id: 8, value: 'NaN' }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: undefined, id: 0, value: 255 },
          { label: undefined, id: 0, value: 255 },
          { label: undefined, id: 0, value: 255 },
          { label: undefined, id: 0, value: 311 },
          { label: undefined, id: 0, value: 311 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: '50%', id: 0, value: 0.50 },
          { label: '51%', id: 0, value: 0.51 },
          { label: '52%', id: 0, value: 0.52 },
          { label: '60%', id: 0, value: 0.60 },
          { label: '62%', id: 0, value: 0.62 }
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

        let ff = qField()(dd);
        let values = ff.values();
        expect(values).to.deep.equal([
          { label: '$41', id: 0, value: 41 },
          { label: '$42', id: 0, value: 42 },
          { label: '$43', id: 0, value: 43 },
          { label: '$71', id: 0, value: 71 },
          { label: '$72', id: 0, value: 72 }
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
      const ff = qField()(dd);

      expect(ff.values()).to.eql([
        { value: 13, label: 'tretton', id: 0 },
        { value: 15, label: 'femton', id: 0 },
        { value: 12, label: 'tolv', id: 0 }
      ]);
    });
  });
});
