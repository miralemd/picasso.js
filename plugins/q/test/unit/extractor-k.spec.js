import extract from '../../src/data/extractor-k';

import {
  getPropsInfo
} from '../../../../src/core/data/util';

describe('q-data-extractor-k', () => {
  const deps = {
    normalizeConfig: getPropsInfo
  };
  describe('without pseudo', () => {
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
              qAttrDims: { qValues: [{}, { qText: 'AlphaDimAttr' }] },
              qElemNo: 1,
              qRow: 7,
              qValue: 'NaN',
              qSubNodes: [
                { qText: '$666', qElemNo: -1, qValue: 666, qType: 'T', qAttrExps: { qValues: [{}, { qText: 'exp-666' }] } },
                { qText: 'a1', qElemNo: 0, qRow: 8, qValue: 123, qAttrExps: { qValues: [{}, { qText: 'exp-a1' }] }, qSubNodes: [{ qValue: 45, qElemNo: 0, qRow: 8, qText: '$45.00', qAttrExps: { qValues: [{}, { qText: 'redish', qNum: 'NaN' }] } }] },
                { qText: 'a2', qElemNo: 3, qRow: 9, qValue: 135, qAttrExps: { qValues: [{}, { qText: 'exp-a2' }] }, qSubNodes: [{ qValue: 32, qElemNo: 0, qRow: 9, qText: '$32.00', qAttrExps: { qValues: [{}, { qText: 'white', qNum: false }] } }] }
              ] },
            {
              qText: 'Beta',
              qAttrDims: { qValues: [{}, { qText: 'BetaDimAttr' }] },
              qElemNo: 3,
              qRow: 10,
              qValue: 2,
              qSubNodes: [
                { qText: '$667', qElemNo: -1, qRow: 11, qValue: 667, qType: 'T', qAttrExps: { qValues: [{}, { qText: 'exp-667' }] } },
                { qText: 'b1', qElemNo: 7, qRow: 12, qValue: 345, qAttrExps: { qValues: [{}, { qText: 'exp-b1' }] }, qSubNodes: [{ qValue: 13, qElemNo: 0, qRow: 12, qText: '$13.00', qAttrExps: { qValues: [{}, { qText: 'red', qNum: 987 }] } }] },
                { qText: 'b3', qElemNo: 9, qRow: 13, qValue: 276, qAttrExps: { qValues: [{}, { qText: 'exp-b2' }] }, qSubNodes: [{ qValue: 17, qElemNo: 0, qRow: 13, qText: '$17.00', qAttrExps: { qValues: [{}, { qText: 'green', qNum: 'NaN' }] } }] }
              ]
            }
          ]
        }
      ]
    };

    const cube = {
      qMode: 'K',
      qDimensionInfo: [{ qStateCounts: {}, qAttrDimInfo: [{}, {}] }, { qStateCounts: {} }],
      qMeasureInfo: [{ qMin: 1, qMax: 2 }],
      qStackedDataPages: [stackedPageWithoutPseudo]
    };

    const fields = [
      { title: () => 'a', value: d => d.qElemNo, key: () => 'qDimensionInfo/0', reduce: values => values.join(', ') },
      { title: () => 'b', value: d => d.qElemNo, key: () => 'qDimensionInfo/1', reduce: values => values.join(', ') },
      { title: () => 'c', value: d => d.qValue, key: () => 'qMeasureInfo/0', reduce: values => values.join(', ') }
    ];

    const dataset = {
      key: () => 'cube',
      raw: () => cube,
      field: sinon.stub()
    };

    dataset.field.withArgs('qDimensionInfo/0').returns(fields[0]);
    dataset.field.withArgs('qDimensionInfo/1').returns(fields[1]);
    dataset.field.withArgs('qMeasureInfo/0').returns(fields[2]);
    const attrDimField = {
      title: () => '',
      value: v => `-${v.qText}-`,
      key: () => 'qDimensionInfo/0/qAttrDimInfo/1',
      reduce: values => values.join(', ')
    };
    dataset.field.withArgs('firstDimSecondAttrDim').returns(attrDimField);

    const attrExprField = {
      title: () => '',
      key: () => 'qDimensionInfo/1/qAttrExprInfo/1',
      reduce: values => values.join(', ')
    };

    dataset.field.withArgs('qDimensionInfo/1/qAttrExprInfo/1').returns(attrExprField);

    it('should return dim field values based on default field accessor', () => {
      const m = extract({
        field: 'qDimensionInfo/0'
      }, dataset, {}, deps);

      expect(m).to.eql([
        { value: 1, source: { key: 'cube', field: 'qDimensionInfo/0' } },
        { value: 3, source: { key: 'cube', field: 'qDimensionInfo/0' } }
      ]);
    });

    it('should return measure field values based on default field accessor', () => {
      const m = extract({
        field: 'qMeasureInfo/0'
      }, dataset, {}, deps);

      expect(m).to.eql([
        { value: 45, source: { key: 'cube', field: 'qMeasureInfo/0' } },
        { value: 32, source: { key: 'cube', field: 'qMeasureInfo/0' } },
        { value: 13, source: { key: 'cube', field: 'qMeasureInfo/0' } },
        { value: 17, source: { key: 'cube', field: 'qMeasureInfo/0' } }
      ]);
    });

    it('should return joined set when array of fields is used', () => {
      const m = extract([
        { field: 'qDimensionInfo/0' },
        { field: 'qDimensionInfo/0', value: v => v.qText }
      ], dataset, {}, deps);

      expect(m).to.eql([
        { value: 1, source: { key: 'cube', field: 'qDimensionInfo/0' } },
        { value: 3, source: { key: 'cube', field: 'qDimensionInfo/0' } },
        { value: 'Alpha', source: { key: 'cube', field: 'qDimensionInfo/0' } },
        { value: 'Beta', source: { key: 'cube', field: 'qDimensionInfo/0' } }
      ]);
    });

    it('should return attr dim field values based on default field accessor', () => {
      const m = extract({
        field: 'firstDimSecondAttrDim'
      }, dataset, {}, deps);

      expect(m).to.eql([
        { value: '-AlphaDimAttr-', source: { key: 'cube', field: 'qDimensionInfo/0/qAttrDimInfo/1' } },
        { value: '-BetaDimAttr-', source: { key: 'cube', field: 'qDimensionInfo/0/qAttrDimInfo/1' } }
      ]);
    });

    it('should return attr expr field values based on default field accessor', () => {
      const m = extract({
        field: 'qDimensionInfo/0',
        props: {
          descs: {
            field: 'qDimensionInfo/1/qAttrExprInfo/1', value: v => `-${v.qText}-`
          }
        }
      }, dataset, {}, deps);

      expect(m).to.eql([
        {
          value: 1,
          source: { key: 'cube', field: 'qDimensionInfo/0' },
          descs: { value: '-exp-666-, -exp-a1-, -exp-a2-', source: { key: 'cube', field: 'qDimensionInfo/1/qAttrExprInfo/1' } }
        },
        {
          value: 3,
          source: { key: 'cube', field: 'qDimensionInfo/0' },
          descs: { value: '-exp-667-, -exp-b1-, -exp-b2-', source: { key: 'cube', field: 'qDimensionInfo/1/qAttrExprInfo/1' } }
        }
      ]);
    });

    it('should return mapped properties from same field', () => {
      const m = extract({
        field: 'qDimensionInfo/1',
        value: d => d.qElemNo,
        props: {
          label: d => d.qText
        }
      }, dataset, {}, deps);

      expect(m).to.eql([
        {
          value: -1,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: '$666', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: 0,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: 'a1', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: 3,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: 'a2', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: -1,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: '$667', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: 7,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: 'b1', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: 9,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          label: { value: 'b3', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        }
      ]);
    });

    it('should return mapped properties to ancestor fields', () => {
      const m = extract({
        field: 'qDimensionInfo/1',
        value: d => d.qElemNo,
        props: {
          parent: {
            field: 'qDimensionInfo/0',
            value: d => d.qText
          }
        }
      }, dataset, { fields }, deps);

      expect(m).to.eql([
        {
          value: -1,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Alpha', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        },
        {
          value: 0,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Alpha', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        },
        {
          value: 3,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Alpha', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        },
        {
          value: -1,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Beta', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        },
        {
          value: 7,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Beta', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        },
        {
          value: 9,
          source: { key: 'cube', field: 'qDimensionInfo/1' },
          parent: { value: 'Beta', source: { key: 'cube', field: 'qDimensionInfo/0' } }
        }
      ]);
    });

    it('should return mapped properties to descendant fields', () => {
      const m = extract({
        field: 'qDimensionInfo/0',
        value: d => d.qElemNo,
        props: {
          descs: {
            field: 'qDimensionInfo/1',
            value: d => d.qText
          }
        }
      }, dataset, { fields }, deps);
      expect(m).to.eql([
        {
          value: 1,
          source: { key: 'cube', field: 'qDimensionInfo/0' },
          descs: { value: '$666, a1, a2', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        },
        {
          value: 3,
          source: { key: 'cube', field: 'qDimensionInfo/0' },
          descs: { value: '$667, b1, b3', source: { key: 'cube', field: 'qDimensionInfo/1' } }
        }
      ]);
    });

    it('should return primitive nodes', () => {
      const m = extract({
        field: 'qDimensionInfo/1',
        value: 'foo',
        props: {
          num: 0,
          bool: false
        }
      }, dataset, { fields }, deps);

      const v = {
        value: 'foo',
        source: { key: 'cube', field: 'qDimensionInfo/1' },
        num: { value: 0 },
        bool: { value: false }
      };
      expect(m).to.eql([v, v, v, v, v, v]);
    });
  });

  describe('with pseudo', () => {
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
              qRow: 7,
              qValue: 'NaN',
              qSubNodes: [
                { qText: 'Sales', qElemNo: 0, qValue: 453, qType: 'P', qMaxPos: 34, qSubNodes: [{ qText: 'Sales-a1' }, { qText: 'Sales-a2' }] },
                { qText: 'Margin', qElemNo: 1, qValue: 0.34, qType: 'P', qMaxPos: 0.7, qSubNodes: [{ qText: 'Margin-a1' }, { qText: 'Margin-a2' }] }
              ]
            },
            {
              qText: 'Beta',
              qElemNo: 3,
              qRow: 10,
              qValue: 2,
              qSubNodes: [
                { qText: 'Sales', qElemNo: 0, qValue: 342, qType: 'P', qMaxPos: 24, qSubNodes: [{ qText: 'Sales-b1' }, { qText: 'Sales-b2' }] },
                { qText: 'Margin', qElemNo: 1, qValue: 0.67, qType: 'P', qMaxPos: 0.5, qSubNodes: [{ qText: 'Margin-b1' }, { qText: 'Margin-b2' }] }
              ]
            }
          ]
        }
      ]
    };

    const cube = {
      qMode: 'K',
      qDimensionInfo: [{ qStateCounts: {} }, { qStateCounts: {} }],
      qMeasureInfo: [{ qMin: 1, qMax: 2 }, { qMin: 0.2, qMax: 0.7 }],
      qStackedDataPages: [stackedPageWithPseudo],
      qEffectiveInterColumnSortOrder: [0, -1, 1]
    };

    const fields = [
      { title: () => 'a', value: d => d.qElemNo, key: () => 'qDimensionInfo/0' },
      { title: () => 'b', value: d => d.qElemNo, key: () => 'qDimensionInfo/1', reduce: values => values.join(', ') },
      { title: () => 'c', value: d => d.qValue, key: () => 'qMeasureInfo/0' },
      { title: () => 'd', value: d => d.qValue, key: () => 'qMeasureInfo/1' }
    ];

    const dataset = {
      key: () => 'cube',
      raw: () => cube,
      field: sinon.stub()
    };

    dataset.field.withArgs('qDimensionInfo/0').returns(fields[0]);
    dataset.field.withArgs('qDimensionInfo/1').returns(fields[1]);
    dataset.field.withArgs('qMeasureInfo/0').returns(fields[2]);
    dataset.field.withArgs('qMeasureInfo/1').returns(fields[3]);

    it('should return proper pseudo measure', () => {
      const m = extract({
        field: 'qMeasureInfo/1'
      }, dataset, { fields }, deps);

      expect(m).to.eql([
        { value: 0.34, source: { key: 'cube', field: 'qMeasureInfo/1' } },
        { value: 0.67, source: { key: 'cube', field: 'qMeasureInfo/1' } }
      ]);
    });

    it('should return proper descendants of pseudo measure', () => {
      const m = extract({
        field: 'qMeasureInfo/1',
        props: {
          descs: {
            field: 'qDimensionInfo/1', value: v => v.qText
          }
        }
      }, dataset, { fields }, deps);

      expect(m).to.eql([
        {
          value: 0.34,
          source: { key: 'cube', field: 'qMeasureInfo/1' },
          descs: {
            value: 'Margin-a1, Margin-a2',
            source: { key: 'cube', field: 'qDimensionInfo/1' }
          }
        },
        {
          value: 0.67,
          source: { key: 'cube', field: 'qMeasureInfo/1' },
          descs: {
            value: 'Margin-b1, Margin-b2',
            source: { key: 'cube', field: 'qDimensionInfo/1' }
          }
        }
      ]);
    });
  });

  // TESTs moved from q-field.spec.js - TODO - enable to ensure 'others' and 'offset' is handled
  // describe.skip('others', () => {
  //   const pageWithOtherNodes = {
  //     qArea: { qLeft: 0, qTop: 1, qWidth: 2, qHeight: 3 },
  //     qMatrix: [
  //       [{}, { qNum: 2, qElemNumber: -3 }],
  //       [{}, { qNum: 4, qText: 'fyra', qElemNumber: 2 }],
  //       [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }]
  //     ]
  //   };
  //   const dd = {
  //     meta: {
  //       qMin: 1,
  //       qMax: 2,
  //       qTags: ['a', 'b'],
  //       qFallbackTitle: 'wohoo'
  //     },
  //     cube: { qMode: 'S' },
  //     pages: [pageWithOtherNodes],
  //     idx: 1
  //   };

  //   it('should fallback to empty string when othersLabel is not defined', () => {
  //     const ff = qField(dd);
  //     const values = ff.items();
  //     expect(values).to.eql([
  //       { qNum: 2, qText: '', qElemNumber: -3, qRow: 1 },
  //       { qNum: 4, qText: 'fyra', qElemNumber: 2, qRow: 2 },
  //       { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 3 }
  //     ]);
  //   });

  //   it('should use the defined othersLabel', () => {
  //     const ff = qField({
  //       meta: {
  //         qMin: 1,
  //         qMax: 2,
  //         qTags: ['a', 'b'],
  //         qFallbackTitle: 'wohoo',
  //         othersLabel: 'dom andra'
  //       },
  //       cube: { qMode: 'S' },
  //       pages: [pageWithOtherNodes],
  //       idx: 1
  //     });
  //     const values = ff.items();
  //     expect(values).to.eql([
  //       { qNum: 2, qText: 'dom andra', qElemNumber: -3, qRow: 1 },
  //       { qNum: 4, qText: 'fyra', qElemNumber: 2, qRow: 2 },
  //       { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 3 }
  //     ]);
  //   });
  // });

  // describe.skip('with offset pages', () => {
    // const page = {
    //   qArea: { qLeft: 0, qTop: 5, qWidth: 2, qHeight: 3 },
    //   qMatrix: [
    //     [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }],
    //     [{}, { qNum: 7, qText: 'sju', qElemNumber: 2 }],
    //     [{}, { qNum: 1, qText: 'ett', qElemNumber: 3 }]
    //   ]
    // };

    // const page2 = {
    //   qArea: { qLeft: 7, qTop: 25, qWidth: 2, qHeight: 3 },
    //   qMatrix: [
    //     [{}, { qNum: 2, qText: 'två', qElemNumber: 1 }],
    //     [{}, { qNum: 6, qText: 'sex', qElemNumber: 2 }],
    //     [{}, { qNum: 3, qText: 'tre', qElemNumber: 3 }]
    //   ]
    // };
  //   const dd = {
  //     meta: {
  //       qMin: 1,
  //       qMax: 2,
  //       qTags: ['a', 'b'],
  //       qFallbackTitle: 'wohoo'
  //     },
  //     cube: { qMode: 'S' },
  //     pages: [page, page2],
  //     idx: 8
  //   };
  //   beforeEach(() => {
  //     f = qField(dd);
  //   });

  //   it('should return values', () => {
  //     const values = f.items();
  //     expect(values).to.deep.equal([
  //       { qNum: 2, qText: 'två', qElemNumber: 1, qRow: 25 },
  //       { qNum: 6, qText: 'sex', qElemNumber: 2, qRow: 26 },
  //       { qNum: 3, qText: 'tre', qElemNumber: 3, qRow: 27 }
  //     ]);
  //   });
  // });
});
