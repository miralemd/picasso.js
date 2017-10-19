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
    { title: () => 'Dim1', value: d => d.qElemNumber, key: () => 'qDimensionInfo/0' },
    { title: () => 'Dim2', value: d => d.qElemNumber, key: () => 'qDimensionInfo/1' },
    { title: () => 'Meas1', value: d => d.qValue, key: () => 'qMeasureInfo/0' }
  ];

  const dataset = {
    raw: () => cube,
    key: () => 'hyper',
    field: sinon.stub()
  };

  let deps;
  beforeEach(() => {
    deps = {
      normalizeConfig: sinon.stub()
    };
  });

  dataset.field.withArgs('Dim1').returns(fields[0]);
  dataset.field.withArgs('Dim2').returns(fields[1]);
  dataset.field.withArgs('qMeasureInfo/0').returns(fields[2]);

  it('should return dim field values based on default field accessor', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('Dim2'),
        value: dataset.field('Dim2').value
      },
      props: {}
    });
    const m = extract({
      field: 'Dim2'
    }, dataset, { fields }, deps);
    expect(m).to.eql([
      { value: 1, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: 2, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: 3, source: { field: 'qDimensionInfo/1', key: 'hyper' } }
    ]);
  });

  it('should return measure field values based on default field accessor', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('qMeasureInfo/0'),
        value: dataset.field('qMeasureInfo/0').value
      },
      props: {}
    });
    const m = extract({
      field: 'qMeasureInfo/0'
    }, dataset, { fields }, deps);
    expect(m).to.eql([
      { value: 53, source: { field: 'qMeasureInfo/0', key: 'hyper' } },
      { value: 57, source: { field: 'qMeasureInfo/0', key: 'hyper' } },
      { value: 51, source: { field: 'qMeasureInfo/0', key: 'hyper' } }
    ]);
  });

  it('should return joined set when array of fields is used', () => {
    deps.normalizeConfig.withArgs({ field: 'qMeasureInfo/0' }, dataset).returns({
      main: {
        field: dataset.field('qMeasureInfo/0'),
        value: dataset.field('qMeasureInfo/0').value
      },
      props: {}
    });
    deps.normalizeConfig.withArgs({ field: 'Dim2' }, dataset).returns({
      main: {
        field: dataset.field('Dim2'),
        value: dataset.field('Dim2').value
      },
      props: {}
    });
    const m = extract([{
      field: 'qMeasureInfo/0'
    }, {
      field: 'Dim2'
    }], dataset, { fields }, deps);
    expect(m).to.eql([
      { value: 53, source: { field: 'qMeasureInfo/0', key: 'hyper' } },
      { value: 57, source: { field: 'qMeasureInfo/0', key: 'hyper' } },
      { value: 51, source: { field: 'qMeasureInfo/0', key: 'hyper' } },
      { value: 1, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: 2, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: 3, source: { field: 'qDimensionInfo/1', key: 'hyper' } }
    ]);
  });

  it('should return raw field values', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('Dim2'),
        value: d => d
      },
      props: {}
    });
    const m = extract({
      field: 'Dim2'
    }, dataset, { fields }, deps);
    expect(m).to.eql([
      { value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 }, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 }, source: { field: 'qDimensionInfo/1', key: 'hyper' } },
      { value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }, source: { field: 'qDimensionInfo/1', key: 'hyper' } }
    ]);
  });

  it('should return mapped properties from same field', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('Dim2'),
        value: d => d
      },
      props: {
        label: {
          value: d => d.qText,
          field: dataset.field('Dim2')
        }
      }
    });
    const m = extract({
      field: 'Dim2'
    }, dataset, { fields }, deps);

    expect(m).to.eql([
      {
        value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        label: { value: 'tre', source: { field: 'qDimensionInfo/1', key: 'hyper' } }
      },
      {
        value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        label: { value: 'sju', source: { field: 'qDimensionInfo/1', key: 'hyper' } }
      },
      {
        value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        label: { value: 'ett', source: { field: 'qDimensionInfo/1', key: 'hyper' } }
      }
    ]);
  });

  it('should return primitive values', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('Dim2'),
        value: 'foo'
      },
      props: {
        num: { value: 0 },
        bool: { value: false }
      }
    });
    const m = extract({
      field: 'Dim2'
    }, dataset, { fields }, deps);
    expect(m).to.eql([
      {
        value: 'foo',
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: 0 },
        bool: { value: false }
      }
    ]);
  });

  it('should return mapped properties from other fields', () => {
    deps.normalizeConfig.returns({
      main: {
        field: dataset.field('Dim2'),
        value: v => v
      },
      props: {
        num: { value: d => d.qText, field: dataset.field('qMeasureInfo/0') }
      }
    });
    const m = extract({
      field: 'Dim2'
    }, dataset, { fields }, deps);
    expect(m).to.eql([
      {
        value: { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: '$53', source: { field: 'qMeasureInfo/0', key: 'hyper' } }
      },
      {
        value: { qNum: 7, qText: 'sju', qElemNumber: 2, qRow: 6 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: '$57', source: { field: 'qMeasureInfo/0', key: 'hyper' } }
      },
      {
        value: { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 },
        source: { field: 'qDimensionInfo/1', key: 'hyper' },
        num: { value: '$51', source: { field: 'qMeasureInfo/0', key: 'hyper' } }
      }
    ]);
  });

  it('should return collected values', () => {
    const fs = [{
      title: () => 'dim',
      key: () => 'dimension1'
    }, {
      title: () => 'me',
      key: () => 'measure1'
    }];
    const c = {
      qMode: 'S',
      qDimensionInfo: [{ qStateCounts: {} }],
      qMeasureInfo: [{}],
      qDataPages: [{
        qArea: { qLeft: 0, qTop: 5, qWidth: 2, qHeight: 3 },
        qMatrix: [
          [{ qNum: 3, qText: 'tre', qElemNumber: 1 }, { qNum: 34 }],
          [{ qNum: 5, qText: 'fem', qElemNumber: 1 }, { qNum: 36 }],
          [{ qNum: 1, qText: 'ett', qElemNumber: 3 }, { qNum: 38 }]
        ]
      }]
    };
    const ds = {
      raw: () => c,
      key: () => 'nyckel',
      field: sinon.stub()
    };

    ds.field.withArgs('dim').returns(fs[0]);
    ds.field.withArgs('me').returns(fs[1]);
    ds.field.throws({ message: 'Field not found' });

    const mainField = ds.field('dim');
    const meField = ds.field('me');
    deps.normalizeConfig.returns({
      main: {
        field: mainField,
        value: v => v
      },
      props: {
        item: { value: d => d, field: meField, source: { key: ds.key(), field: meField.key() } }
      }
    });
    const m = extract({
      field: 'dim',
      trackBy: 'qElemNumber'
    }, ds, { fields: fs }, deps);
    expect(m).to.eql([
      {
        value: [
          { qNum: 3, qText: 'tre', qElemNumber: 1, qRow: 5 },
          { qNum: 5, qText: 'fem', qElemNumber: 1, qRow: 6 }
        ],
        source: { field: 'dimension1', key: 'nyckel' },
        item: {
          value: [
            { qNum: 34, qRow: 5 },
            { qNum: 36, qRow: 6 }
          ],
          source: { field: 'measure1', key: 'nyckel' } }
      },
      {
        value: [
          { qNum: 1, qText: 'ett', qElemNumber: 3, qRow: 7 }
        ],
        source: { field: 'dimension1', key: 'nyckel' },
        item: {
          value: [{ qNum: 38, qRow: 7 }],
          source: { field: 'measure1', key: 'nyckel' } }
      }
    ]);
  });

  it('should return reduced values', () => {
    const fs = [{
      title: () => 'reduceMe',
      key: () => 'reduuuced'
    }, {
      title: () => 'minime',
      key: () => 'measure1'
    }];
    const c = {
      qMode: 'S',
      qDimensionInfo: [{ qStateCounts: {} }],
      qMeasureInfo: [],
      qDataPages: [{
        qArea: { qLeft: 0, qTop: 5, qWidth: 2, qHeight: 3 },
        qMatrix: [
          [{ qNum: 3, qText: 'tre', qElemNumber: 1 }, { qNum: 34 }],
          [{ qNum: 5, qText: 'fem', qElemNumber: 1 }, { qNum: 36 }],
          [{ qNum: 1, qText: 'ett', qElemNumber: 3 }, { qNum: 38 }]
        ]
      }]
    };
    const ds = {
      raw: () => c,
      key: () => 'nyckel',
      field: sinon.stub()
    };

    ds.field.withArgs('reduuuced').returns(fs[0]);
    ds.field.withArgs('minime').returns(fs[1]);
    ds.field.throws({ message: 'Field not found' });

    const mainField = ds.field('reduuuced');
    const meField = ds.field('minime');
    deps.normalizeConfig.returns({
      main: {
        field: mainField,
        value: v => v
      },
      props: {
        item: { value: d => d, field: meField, source: { key: ds.key(), field: meField.key() } }
      }
    });
    deps.normalizeConfig.returns({
      main: {
        field: mainField,
        value: v => v,
        reduce: values => values.map(v => v.qText).join(',')
      },
      props: {
        item: { value: d => d.qElemNumber, field: mainField, source: { key: ds.key(), field: mainField.key() } },
        min: {
          value: d => d.qNum,
          field: meField,
          source: { key: ds.key(), field: meField.key() },
          reduce: values => Math.min(...values)
        }
      }
    });
    const m = extract({
      field: 'reduuuced',
      trackBy: cell => cell.qElemNumber
    }, ds, { fields: fs }, deps);
    expect(m).to.eql([
      {
        value: 'tre,fem',
        source: { field: 'reduuuced', key: 'nyckel' },
        item: { value: [1, 1], source: { field: 'reduuuced', key: 'nyckel' } },
        min: { value: 34, source: { field: 'measure1', key: 'nyckel' } }
      },
      {
        value: 'ett',
        source: { field: 'reduuuced', key: 'nyckel' },
        item: { value: [3], source: { field: 'reduuuced', key: 'nyckel' } },
        min: { value: 38, source: { field: 'measure1', key: 'nyckel' } }
      }
    ]);
  });
});