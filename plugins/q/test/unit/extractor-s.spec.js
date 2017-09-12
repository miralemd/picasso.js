import extract from '../../src/data/extractor-s';

describe('extractor-s', () => {
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

  const cube = {
    qMode: 'S',
    qDimensionInfo: [{ label: 'A', qStateCounts: {} }, { label: 'B', qStateCounts: {} }],
    qMeasureInfo: [{ label: 'M', qMin: 1, qMax: 2 }],
    qDataPages: [page, page2]
  };

  const fields = [
    { title: () => 'Dim1', value: d => d.qElemNumber },
    { title: () => 'Dim2', value: d => d.qElemNumber },
    { title: () => 'Meas1', value: d => d.qValue }
  ];

  it('should return dim field values based on default field accessor', () => {
    const m = extract({
      field: '/qDimensionInfo/1'
    }, cube, { fields });
    expect(m).to.eql([
      { value: 1, source: { field: '/qDimensionInfo/1' } },
      { value: 2, source: { field: '/qDimensionInfo/1' } },
      { value: 3, source: { field: '/qDimensionInfo/1' } }
    ]);
  });

  it('should return measure field values based on default field accessor', () => {
    const m = extract({
      field: '/qMeasureInfo/0'
    }, cube, { fields });
    expect(m).to.eql([
      { value: 53, source: { field: '/qMeasureInfo/0' } },
      { value: 57, source: { field: '/qMeasureInfo/0' } },
      { value: 51, source: { field: '/qMeasureInfo/0' } }
    ]);
  });

  it('should return joined set when array of fields is used', () => {
    const m = extract([{
      field: '/qMeasureInfo/0'
    }, {
      field: '/qDimensionInfo/1'
    }], cube, { fields });
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
    const m = extract({
      field: '/qDimensionInfo/1',
      value: d => d
    }, cube, { fields });
    expect(m).to.eql([
      { value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 }, source: { field: '/qDimensionInfo/1' } },
      { value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 }, source: { field: '/qDimensionInfo/1' } },
      { value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }, source: { field: '/qDimensionInfo/1' } }
    ]);
  });

  it('should return mapped properties from same field', () => {
    const m = extract({
      field: '/qDimensionInfo/1',
      value: d => d,
      props: {
        label: d => d.qText
      }
    }, cube, { fields });
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
    const m = extract({
      field: '/qDimensionInfo/1',
      value: 'foo',
      props: {
        num: 0,
        bool: false
      }
    }, cube, { fields });
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
    const m = extract({
      field: '/qDimensionInfo/1',
      value: d => d,
      props: {
        num: {
          field: '/qMeasureInfo/0',
          value: d => d.qText
        }
      }
    }, cube, { fields });
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
    const m = extract({
      field: '/qDimensionInfo/0',
      trackBy: 'qElemNumber',
      props: {
        item: { value: d => d }
      }
    }, {
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
    }, { fields: [{}] });
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
    const m = extract({
      field: '/qDimensionInfo/0',
      trackBy: 'qElemNumber',
      props: {
        item: { value: d => d.qElemNumber },
        min: { value: d => d.qNum, reduce: value => Math.min(...value) },
        max: { value: d => d.qNum, reduce: value => Math.max(...value) }
      }
    }, {
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
    }, { fields: [{}] });
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
