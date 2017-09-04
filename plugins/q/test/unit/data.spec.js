import q from '../../src/data';
import { getPathToFieldItems } from '../../src/data/transform-k';

describe('data-transform', () => {
  const page = {
    qArea: { qLeft: 0, qTop: 5, qWidth: 3, qHeight: 3 },
    qMatrix: [
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }, { qValue: 53, qText: '$53' }],
      [{}, { qNum: 7, qText: 'sju', qElemNumber: 2 }, { qValue: 57, qText: '$57' }],
      [{}, { qNum: 1, qText: 'ett', qElemNumber: 3 }, { qValue: 51, qText: '$51' }]
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

  describe('straight mapping', () => {
    const cube = {
      qMode: 'S',
      qDimensionInfo: [{ label: 'A', qStateCounts: {} }, { label: 'B', qStateCounts: {} }],
      qMeasureInfo: [{ label: 'M', qMin: 1, qMax: 2 }],
      qDataPages: [page, page2]
    };

    it('should return dim field values based on default field accessor', () => {
      const m = q(cube).extract({
        field: '/qDimensionInfo/1'
      });
      expect(m).to.eql([
        { value: 1, source: { field: '/qDimensionInfo/1' } },
        { value: 2, source: { field: '/qDimensionInfo/1' } },
        { value: 3, source: { field: '/qDimensionInfo/1' } }
      ]);
    });

    it('should return measure field values based on default field accessor', () => {
      const m = q(cube).extract({
        field: '/qMeasureInfo/0'
      });
      expect(m).to.eql([
        { value: 53, source: { field: '/qMeasureInfo/0' } },
        { value: 57, source: { field: '/qMeasureInfo/0' } },
        { value: 51, source: { field: '/qMeasureInfo/0' } }
      ]);
    });

    it('should return joined set when array of fields is used', () => {
      const m = q(cube).extract([{
        field: '/qMeasureInfo/0'
      }, {
        field: '/qDimensionInfo/1'
      }]);
      expect(m).to.eql([
        { value: 53, source: { field: '/qMeasureInfo/0' } },
        { value: 57, source: { field: '/qMeasureInfo/0' } },
        { value: 51, source: { field: '/qMeasureInfo/0' } },
        { value: 1, source: { field: '/qDimensionInfo/1' } },
        { value: 2, source: { field: '/qDimensionInfo/1' } },
        { value: 3, source: { field: '/qDimensionInfo/1' } }
      ]);
    });

    it('should return raw field values', () => {
      const m = q(cube).extract({
        field: '/qDimensionInfo/1',
        value: d => d
      });
      expect(m).to.eql([
        { value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 }, source: { field: '/qDimensionInfo/1' } },
        { value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 }, source: { field: '/qDimensionInfo/1' } },
        { value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }, source: { field: '/qDimensionInfo/1' } }
      ]);
    });

    it('should return mapped properties from same field', () => {
      const m = q(cube).extract({
        field: '/qDimensionInfo/1',
        value: d => d,
        props: {
          label: d => d.qText
        }
      });
      expect(m).to.eql([
        {
          value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
          source: { field: '/qDimensionInfo/1' },
          label: { value: 'tre', source: { field: '/qDimensionInfo/1' } }
        },
        {
          value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 },
          source: { field: '/qDimensionInfo/1' },
          label: { value: 'sju', source: { field: '/qDimensionInfo/1' } }
        },
        {
          value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 },
          source: { field: '/qDimensionInfo/1' },
          label: { value: 'ett', source: { field: '/qDimensionInfo/1' } }
        }
      ]);
    });

    it('should return primitive values', () => {
      const m = q(cube).extract({
        field: '/qDimensionInfo/1',
        value: 'foo',
        props: {
          num: 0,
          bool: false
        }
      });
      expect(m).to.eql([
        {
          value: 'foo',
          source: { field: '/qDimensionInfo/1' },
          num: { value: 0 },
          bool: { value: false }
        },
        {
          value: 'foo',
          source: { field: '/qDimensionInfo/1' },
          num: { value: 0 },
          bool: { value: false }
        },
        {
          value: 'foo',
          source: { field: '/qDimensionInfo/1' },
          num: { value: 0 },
          bool: { value: false }
        }
      ]);
    });

    it('should return mapped properties from other fields', () => {
      const m = q(cube).extract({
        field: '/qDimensionInfo/1',
        value: d => d,
        props: {
          num: {
            field: '/qMeasureInfo/0',
            value: d => d.qText
          }
        }
      });
      expect(m).to.eql([
        {
          value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
          source: { field: '/qDimensionInfo/1' },
          num: { value: '$53', source: { field: '/qMeasureInfo/0' } }
        },
        {
          value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 },
          source: { field: '/qDimensionInfo/1' },
          num: { value: '$57', source: { field: '/qMeasureInfo/0' } }
        },
        {
          value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 },
          source: { field: '/qDimensionInfo/1' },
          num: { value: '$51', source: { field: '/qMeasureInfo/0' } }
        }
      ]);
    });

    it('should return collected values', () => {
      const m = q({
        qMode: 'S',
        qDimensionInfo: [{ qStateCounts: {} }],
        qMeasureInfo: [],
        qDataPages: [{
          qArea: { qLeft: 0, qTop: 5, qWidth: 1, qHeight: 3 },
          qMatrix: [
            [{ qNum: 3, qText: 'tre', qElemNumber: 1 }],
            [{ qNum: 5, qText: 'fem', qElemNumber: 1 }],
            [{ qNum: 1, qText: 'ett', qElemNumber: 3 }]
          ]
        }]
      }).extract({
        field: '/qDimensionInfo/0',
        trackBy: 'qElemNumber',
        props: {
          item: { value: d => d }
        }
      });
      expect(m).to.eql([
        {
          item: {
            value: [
              { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
              { qNum: 5, qText: 'fem', qElemNumber: 1, qRow: 6 }
            ],
            source: { field: '/qDimensionInfo/0' } }
        },
        {
          item: {
            value: [{ qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }],
            source: { field: '/qDimensionInfo/0' } }
        }
      ]);
    });

    it('should return reduced values', () => {
      const m = q({
        qMode: 'S',
        qDimensionInfo: [{ qStateCounts: {} }],
        qMeasureInfo: [],
        qDataPages: [{
          qArea: { qLeft: 0, qTop: 5, qWidth: 1, qHeight: 3 },
          qMatrix: [
            [{ qNum: 3, qText: 'tre', qElemNumber: 1 }],
            [{ qNum: 5, qText: 'fem', qElemNumber: 1 }],
            [{ qNum: 1, qText: 'ett', qElemNumber: 3 }]
          ]
        }]
      }).extract({
        field: '/qDimensionInfo/0',
        trackBy: 'qElemNumber',
        props: {
          item: { value: d => d.qElemNumber },
          min: { value: d => d.qNum, reduce: value => Math.min(...value) },
          max: { value: d => d.qNum, reduce: value => Math.max(...value) }
        }
      });
      expect(m).to.eql([
        {
          item: { value: [1, 1], source: { field: '/qDimensionInfo/0' } },
          min: { value: 3, source: { field: '/qDimensionInfo/0' } },
          max: { value: 5, source: { field: '/qDimensionInfo/0' } }
        },
        {
          item: { value: [3], source: { field: '/qDimensionInfo/0' } },
          min: { value: 1, source: { field: '/qDimensionInfo/0' } },
          max: { value: 1, source: { field: '/qDimensionInfo/0' } }
        }
      ]);
    });
  });

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

    const d = q(cube);

    it('should find attribute dimension on dimension', () => {
      const f = d.field('/qDimensionInfo/0/qAttrDimInfo/1');
      expect(f.title()).to.eql('attr dim title');
    });

    it('should find attribute expression on dimension', () => {
      const f = d.field('/qDimensionInfo/0/qAttrExprInfo/0');
      expect(f.title()).to.eql('attr expr title');
    });

    it('should find attribute dimension on measure', () => {
      const f = d.field('/qMeasureInfo/2/qAttrDimInfo/2');
      expect(f.title()).to.eql('m attr dim title');
    });

    it('should find attribute expression on measure', () => {
      const f = d.field('/qMeasureInfo/2/qAttrExprInfo/1');
      expect(f.title()).to.eql('m attr expr title');
    });
  });

  describe('stacked mapping', () => {
    describe('paths', () => {
      const cache = {
        fields: [{}, {}, {}]
      };
      const cube = {
        qDimensionInfo: [{}, {}],
        qMeasureInfo: [{}]
      };

      it('should point to first dimension cells', () => {
        const p = getPathToFieldItems(cache.fields[0], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes');
      });
      it('should point to second dimension cells', () => {
        const p = getPathToFieldItems(cache.fields[1], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes');
      });
      it('should point to first measure cells', () => {
        const p = getPathToFieldItems(cache.fields[2], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes/*/qSubNodes/0');
      });
    });

    describe('paths with pseudo dim and reordered columns', () => {
      const cache = {
        fields: [{}, {}, {}, {}],
        attributeDimensionFields: [null, [{}], null, [{}, {}]],
        attributeExpressionFields: [[{}, {}], [{}]]
      };
      const cube = {
        qDimensionInfo: [{}, {}],
        qMeasureInfo: [{}, {}],
        qEffectiveInterColumnSortOrder: [1, -1, 0]
      };

      it('should point to first dimension cells', () => {
        const p = getPathToFieldItems(cache.fields[0], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes/*/qSubNodes');
      });
      it('should point to second dimension cells', () => {
        const p = getPathToFieldItems(cache.fields[1], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes');
      });
      it('should point to first measure cells', () => {
        const p = getPathToFieldItems(cache.fields[2], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes/0/qSubNodes/*/qSubNodes');
      });
      it('should point to first attrDim of second dimension', () => {
        const p = getPathToFieldItems(cache.attributeDimensionFields[1][0], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qAttrDims/qValues/0');
      });
      it('should point to second attrExpr of first dimension', () => {
        const p = getPathToFieldItems(cache.attributeExpressionFields[0][1], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes/*/qSubNodes/*/qAttrExps/qValues/1');
      });
      it('should point to second attrDim of second measure', () => {
        const p = getPathToFieldItems(cache.attributeDimensionFields[3][1], { cache, cube });
        expect(p).to.eql('/qData/*/qSubNodes/*/qSubNodes/1/qSubNodes/*/qSubNodes/*/qAttrDims/qValues/1');
      });
    });

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
                  { qText: '$667', qElemNo: -1, qRow: 11, qValue: 667, qType: 'T' },
                  { qText: 'b1', qElemNo: 7, qRow: 12, qValue: 345, qSubNodes: [{ qValue: 13, qElemNo: 0, qRow: 12, qText: '$13.00', qAttrExps: { qValues: [{}, { qText: 'red', qNum: 987 }] } }] },
                  { qText: 'b3', qElemNo: 9, qRow: 13, qValue: 276, qSubNodes: [{ qValue: 17, qElemNo: 0, qRow: 13, qText: '$17.00', qAttrExps: { qValues: [{}, { qText: 'green', qNum: 'NaN' }] } }] }
                ]
              }
            ]
          }
        ]
      };

      const cube = {
        qMode: 'K',
        qDimensionInfo: [{ qStateCounts: {} }, { qStateCounts: {} }],
        qMeasureInfo: [{ qMin: 1, qMax: 2 }],
        qStackedDataPages: [stackedPageWithoutPseudo]
      };

      it('should return dim field values based on default field accessor', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/0'
        });
        expect(m).to.eql([
          { value: 1, source: { field: '/qDimensionInfo/0' } },
          { value: 3, source: { field: '/qDimensionInfo/0' } }
        ]);
      });

      it('should return measure field values based on default field accessor', () => {
        const m = q(cube).extract({
          field: '/qMeasureInfo/0'
        });
        expect(m).to.eql([
          { value: 666, source: { field: '/qMeasureInfo/0' } },
          { value: 45, source: { field: '/qMeasureInfo/0' } },
          { value: 32, source: { field: '/qMeasureInfo/0' } },
          { value: 667, source: { field: '/qMeasureInfo/0' } },
          { value: 13, source: { field: '/qMeasureInfo/0' } },
          { value: 17, source: { field: '/qMeasureInfo/0' } }
        ]);
      });

      it('should return joined set from array of field configs', () => {
        const m = q(cube).extract([{
          field: '/qDimensionInfo/0'
        }, {
          field: '/qDimensionInfo/1'
        }]);
        expect(m).to.eql([
           { value: 1, source: { field: '/qDimensionInfo/0' } },
           { value: 3, source: { field: '/qDimensionInfo/0' } },
           { value: -1, source: { field: '/qDimensionInfo/1' } },
           { value: 0, source: { field: '/qDimensionInfo/1' } },
           { value: 3, source: { field: '/qDimensionInfo/1' } },
           { value: -1, source: { field: '/qDimensionInfo/1' } },
           { value: 7, source: { field: '/qDimensionInfo/1' } },
           { value: 9, source: { field: '/qDimensionInfo/1' } }
        ]);
      });

      it('should return raw field values', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/1',
          value: d => d
        });
        expect(m).to.eql([
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[0], source: { field: '/qDimensionInfo/1' } },
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[1], source: { field: '/qDimensionInfo/1' } },
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[0].qSubNodes[2], source: { field: '/qDimensionInfo/1' } },
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[0], source: { field: '/qDimensionInfo/1' } },
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[1], source: { field: '/qDimensionInfo/1' } },
          { value: stackedPageWithoutPseudo.qData[0].qSubNodes[1].qSubNodes[2], source: { field: '/qDimensionInfo/1' } }
        ]);
      });

      it('should return mapped properties from same field', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/1',
          value: d => d.qElemNo,
          props: {
            label: d => d.qText
          }
        });
        expect(m).to.eql([
          {
            value: -1,
            source: { field: '/qDimensionInfo/1' },
            label: { value: '$666', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: 0,
            source: { field: '/qDimensionInfo/1' },
            label: { value: 'a1', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: 3,
            source: { field: '/qDimensionInfo/1' },
            label: { value: 'a2', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: -1,
            source: { field: '/qDimensionInfo/1' },
            label: { value: '$667', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: 7,
            source: { field: '/qDimensionInfo/1' },
            label: { value: 'b1', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: 9,
            source: { field: '/qDimensionInfo/1' },
            label: { value: 'b3', source: { field: '/qDimensionInfo/1' } }
          }
        ]);
      });

      it('should return primitive values', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/1',
          value: 'foo',
          props: {
            num: 0,
            bool: false
          }
        });
        const v = {
          value: 'foo',
          source: { field: '/qDimensionInfo/1' },
          num: { value: 0 },
          bool: { value: false }
        };
        expect(m).to.eql([v, v, v, v, v, v]);
      });

      it('should return mapped properties to ancestor fields', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/1',
          value: d => d.qElemNo,
          props: {
            parent: {
              field: '/qDimensionInfo/0',
              value: d => d.qText
            }
          }
        });
        expect(m).to.eql([
          {
            value: -1,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Alpha', source: { field: '/qDimensionInfo/0' } }
          },
          {
            value: 0,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Alpha', source: { field: '/qDimensionInfo/0' } }
          },
          {
            value: 3,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Alpha', source: { field: '/qDimensionInfo/0' } }
          },
          {
            value: -1,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Beta', source: { field: '/qDimensionInfo/0' } }
          },
          {
            value: 7,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Beta', source: { field: '/qDimensionInfo/0' } }
          },
          {
            value: 9,
            source: { field: '/qDimensionInfo/1' },
            parent: { value: 'Beta', source: { field: '/qDimensionInfo/0' } }
          }
        ]);
      });

      it('should return mapped properties to descendant fields', () => {
        const m = q(cube).extract({
          field: '/qDimensionInfo/0',
          value: d => d.qElemNo,
          props: {
            descs: {
              field: '/qDimensionInfo/1',
              value: d => d.qText
            }
          }
        });
        expect(m).to.eql([
          {
            value: 1,
            source: { field: '/qDimensionInfo/0' },
            descs: { value: '$666, a1, a2', source: { field: '/qDimensionInfo/1' } }
          },
          {
            value: 3,
            source: { field: '/qDimensionInfo/0' },
            descs: { value: '$667, b1, b3', source: { field: '/qDimensionInfo/1' } }
          }
        ]);
      });
    });
  });

  describe('hierarchical data', () => {
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
            qText: '_rooot',
            qElemNo: 0,
            qSubNodes: [
              {
                qText: 'Alpha',
                qElemNo: 1,
                qRow: 7,
                qValue: 'NaN',
                qSubNodes: [
                  { qText: 'total: $666', qElemNo: -1, qValue: 666, qType: 'T' },
                  { qText: 'a1', qElemNo: 0, qRow: 8, qValue: 123, qSubNodes: [{ qValue: 45, qElemNo: 0, qRow: 8, qText: '$45.00', qAttrExps: { qValues: [{}, { qText: 'redish', qNum: 'NaN' }] } }] },
                  { qText: 'a2', qElemNo: 3, qRow: 9, qValue: 135, qSubNodes: [{ qValue: 32, qElemNo: 0, qRow: 9, qText: '$32.00', qAttrExps: { qValues: [{}, { qText: 'white', qNum: false }] } }] }
                ] },
              {
                qText: 'Beta',
                qElemNo: 3,
                qRow: 10,
                qValue: 2,
                qSubNodes: [
                  { qText: 'total: $667', qElemNo: -1, qRow: 11, qValue: 667, qType: 'T' },
                  { qText: 'b1', qElemNo: 7, qRow: 12, qValue: 345, qSubNodes: [{ qValue: 13, qElemNo: 0, qRow: 12, qText: '$13.00', qAttrExps: { qValues: [{}, { qText: 'red', qNum: 987 }] } }] },
                  { qText: 'b3', qElemNo: 9, qRow: 13, qValue: 276, qSubNodes: [{ qValue: 17, qElemNo: 0, qRow: 13, qText: '$17.00', qAttrExps: { qValues: [{}, { qText: 'green', qNum: 'NaN' }] } }] }
                ]
              }
            ]
          }
        ]
      };

      const cube = {
        qMode: 'K',
        qDimensionInfo: [{ qFallbackTitle: 'first', qStateCounts: {} }, { qFallbackTitle: 'second', qStateCounts: {} }],
        qMeasureInfo: [{ qFallbackTitle: 'emasure', qMin: 1, qMax: 2 }],
        qStackedDataPages: [stackedPageWithoutPseudo],
        qEffectiveInterColumnSortOrder: [0, 1]
      };

      it('should return a root node', () => {
        const m = q(cube).hierarchy();
        expect(m.data.value).to.eql(stackedPageWithoutPseudo.qData[0]);
      });

      it('should add a data property per node', () => {
        const m = q(cube).hierarchy({
          value: d => d.qText
        });
        expect(m.descendants().map(child => child.data.value)).to.eql(['_rooot', 'Alpha', 'Beta', 'total: $666', 'a1', 'a2', 'total: $667', 'b1', 'b3', '$45.00', '$32.00', '$13.00', '$17.00']);
      });

      it('should add a data property of an ancestor node', () => {
        const m = q(cube).hierarchy({
          props: {
            dimOne: {
              field: '/qDimensionInfo/0',
              value: d => d.qText
            }
          }
        });
        // console.log(stackedPageWithoutPseudo.qData[0]);
        expect(m.descendants().map(child => child.data.dimOne.value)).to.eql(['Alpha, Beta', 'Alpha', 'Beta', 'Alpha', 'Alpha', 'Alpha', 'Beta', 'Beta', 'Beta', 'Alpha', 'Alpha', 'Beta', 'Beta']);
      });

      it('should add a data property of a descendant node', () => {
        const m = q(cube).hierarchy({
          props: {
            desc: {
              field: '/qDimensionInfo/1',
              value: d => d.qText
            }
          }
        });
        // console.log(stackedPageWithoutPseudo.qData[0]);
        expect(m.descendants().map(child => child.data.desc.value)).to.eql([
          'total: $666, a1, a2, total: $667, b1, b3', // descendants of '__root', with reduction (join) applied
          'total: $666, a1, a2', // children of 'Alpha', with reduction applied
          'total: $667, b1, b3', // children of 'Beta', with reduction applied
          'total: $666',
          'a1',
          'a2',
          'total: $667',
          'b1',
          'b3',
          'a1', // from measure node
          'a2', // from measure node
          'b1', // from measure node
          'b3' // from measure node
        ]);
      });

      it('should add a data property of reduced values', () => {
        const m = q(cube).hierarchy({
          props: {
            desc: {
              field: '/qMeasureInfo/0',
              value: d => (d ? d.qValue : d),
              reduce: values => values.join('---')
            },
            p: d => d.qText
          }
        });
        // console.log(stackedPageWithoutPseudo.qData[0]);
        expect(m.descendants().map(child => child.data.desc.value)).to.eql([
          '666---45---32---667---13---17', // descendants of '__root', with reduction applied
          '666---45---32', // measure nodes in 'Alpha', with reduction applied
          '667---13---17', // measure nodes in 'Beta', with reduction applied
          undefined, // total node
          45,
          32,
          undefined,
          13,
          17,
          45, // actual measure node
          32, // actual measure node
          13, // actual measure node
          17 // actual measure node
        ]);
      });
    });
  });
});
