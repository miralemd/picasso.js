import extract from '../../../../src/core/data/extractor-matrix';

describe('straight mapping', () => {
  const fields = [
    { key: () => 'fkey', items: () => ['SE', 'IT', 'SE'] },
    { key: () => 'fkey2', items: () => [3, 7, 2] }
  ];

  const dataset = {
    field: idx => fields[idx],
    key: () => 'nyckel'
  };

  it('should return dim field values based on default field accessor', () => {
    const m = extract({ field: 0 }, dataset);
    expect(m).to.eql([
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } },
      { value: 'IT', source: { field: 'fkey', key: 'nyckel' } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } }
    ]);
  });

  it('should return joined set when array of fields is used', () => {
    const m = extract([{ field: 1 }, { field: 0 }], dataset);
    expect(m).to.eql([
      { value: 3, source: { field: 'fkey2', key: 'nyckel' } },
      { value: 7, source: { field: 'fkey2', key: 'nyckel' } },
      { value: 2, source: { field: 'fkey2', key: 'nyckel' } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } },
      { value: 'IT', source: { field: 'fkey', key: 'nyckel' } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } }
    ]);
  });

  it('should support custom accessor', () => {
    const m = extract({
      field: 0,
      value: v => `-${v}-`
    }, dataset);
    expect(m).to.eql([
      { value: '-SE-', source: { field: 'fkey', key: 'nyckel' } },
      { value: '-IT-', source: { field: 'fkey', key: 'nyckel' } },
      { value: '-SE-', source: { field: 'fkey', key: 'nyckel' } }
    ]);
  });

  it('should return mapped properties from same field', () => {
    const m = extract({
      field: 0,
      props: { label: { value: v => `(${v})` } }
    }, dataset);
    expect(m).to.eql([
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' }, label: { value: '(SE)', source: { field: 'fkey', key: 'nyckel' } } },
      { value: 'IT', source: { field: 'fkey', key: 'nyckel' }, label: { value: '(IT)', source: { field: 'fkey', key: 'nyckel' } } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' }, label: { value: '(SE)', source: { field: 'fkey', key: 'nyckel' } } }
    ]);
  });

  it('should return primitive values', () => {
    const m = extract({
      field: 1,
      value: 'foo',
      props: {
        num: 0,
        bool: false
      }
    }, dataset);
    expect(m).to.eql([
      {
        value: 'foo',
        source: { field: 'fkey2', key: 'nyckel' },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 'fkey2', key: 'nyckel' },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 'fkey2', key: 'nyckel' },
        num: { value: 0 },
        bool: { value: false }
      }
    ]);
  });

  it('should return mapped properties from other fields', () => {
    const m = extract({
      field: 0,
      props: {
        num: { field: 1 }
      }
    }, dataset);
    expect(m).to.eql([
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' }, num: { value: 3, source: { field: 'fkey2', key: 'nyckel' } } },
      { value: 'IT', source: { field: 'fkey', key: 'nyckel' }, num: { value: 7, source: { field: 'fkey2', key: 'nyckel' } } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' }, num: { value: 2, source: { field: 'fkey2', key: 'nyckel' } } }
    ]);
  });

  it('should filter values on main field', () => {
    const m = extract({
      field: 0,
      filter: v => v !== 'IT'
    }, dataset);
    expect(m).to.eql([
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } },
      { value: 'SE', source: { field: 'fkey', key: 'nyckel' } }
    ]);
  });

  it('should return collected values', () => {
    const m = extract({
      field: 0,
      trackBy: v => v,
      props: {
        item: { field: 1 }
      }
    }, dataset);
    expect(m).to.eql([
      {
        source: { field: 'fkey', key: 'nyckel' },
        value: ['SE', 'SE'],
        item: { value: [3, 2], source: { field: 'fkey2', key: 'nyckel' } }
      },
      {
        source: { field: 'fkey', key: 'nyckel' },
        value: ['IT'],
        item: { value: [7], source: { field: 'fkey2', key: 'nyckel' } }
      }
    ]);
  });

  it('should return reduced values', () => {
    const ffs = [
      { key: () => 'fkey', items: () => ['SE', 'IT', 'SE', 'SE', 'SE'] },
      { key: () => 'fkey2', items: () => [5, 25, 4, 8, 7] }
    ];
    const ds = {
      field: idx => ffs[idx],
      key: () => 'nyckel'
    };
    const m = extract({
      field: 0,
      trackBy: v => v,
      reduce: values => values.join('--'),
      props: {
        item: { reduce: 'first' },
        min: { field: 1, reduce: 'min' },
        max: { field: 1, reduce: 'max' },
        sum: { field: 1, reduce: 'sum' },
        avg: { field: 1, reduce: 'avg' },
        first: { field: 1, reduce: 'first' },
        last: { field: 1, reduce: 'last' }
      }
    }, ds);
    expect(m).to.eql([
      {
        value: 'SE--SE--SE--SE',
        source: { field: 'fkey', key: 'nyckel' },
        item: { value: 'SE', source: { field: 'fkey', key: 'nyckel' } },
        min: { value: 4, source: { field: 'fkey2', key: 'nyckel' } },
        max: { value: 8, source: { field: 'fkey2', key: 'nyckel' } },
        sum: { value: 24, source: { field: 'fkey2', key: 'nyckel' } },
        avg: { value: 6, source: { field: 'fkey2', key: 'nyckel' } },
        first: { value: 5, source: { field: 'fkey2', key: 'nyckel' } },
        last: { value: 7, source: { field: 'fkey2', key: 'nyckel' } }
      },
      {
        value: 'IT',
        source: { field: 'fkey', key: 'nyckel' },
        item: { value: 'IT', source: { field: 'fkey', key: 'nyckel' } },
        min: { value: 25, source: { field: 'fkey2', key: 'nyckel' } },
        max: { value: 25, source: { field: 'fkey2', key: 'nyckel' } },
        sum: { value: 25, source: { field: 'fkey2', key: 'nyckel' } },
        avg: { value: 25, source: { field: 'fkey2', key: 'nyckel' } },
        first: { value: 25, source: { field: 'fkey2', key: 'nyckel' } },
        last: { value: 25, source: { field: 'fkey2', key: 'nyckel' } }
      }
    ]);
  });
});
