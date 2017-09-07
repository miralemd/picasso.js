import { extract } from '../../../../src/core/data/extractor-matrix';

describe('straight mapping', () => {
  const fields = [
    { items: () => ['SE', 'IT', 'SE'] },
    { items: () => [3, 7, 2] }
  ];

  it('should return dim field values based on default field accessor', () => {
    const m = extract({ field: 0 }, null, { fields });
    expect(m).to.eql([
      { value: 'SE', source: { field: 0 } },
      { value: 'IT', source: { field: 0 } },
      { value: 'SE', source: { field: 0 } }
    ]);
  });

  it('should return joined set when array of fields is used', () => {
    const m = extract([{ field: 1 }, { field: 0 }], null, { fields });
    expect(m).to.eql([
      { value: 3, source: { field: 1 } },
      { value: 7, source: { field: 1 } },
      { value: 2, source: { field: 1 } },
      { value: 'SE', source: { field: 0 } },
      { value: 'IT', source: { field: 0 } },
      { value: 'SE', source: { field: 0 } }
    ]);
  });

  it('should support custom accessor', () => {
    const m = extract({
      field: 0,
      value: v => `-${v}-`
    }, null, { fields });
    expect(m).to.eql([
      { value: '-SE-', source: { field: 0 } },
      { value: '-IT-', source: { field: 0 } },
      { value: '-SE-', source: { field: 0 } }
    ]);
  });

  it('should return mapped properties from same field', () => {
    const m = extract({
      field: 0,
      props: { label: v => `(${v})` }
    }, null, { fields });
    expect(m).to.eql([
      { value: 'SE', source: { field: 0 }, label: { value: '(SE)', source: { field: 0 } } },
      { value: 'IT', source: { field: 0 }, label: { value: '(IT)', source: { field: 0 } } },
      { value: 'SE', source: { field: 0 }, label: { value: '(SE)', source: { field: 0 } } }
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
    }, null, { fields });
    expect(m).to.eql([
      {
        value: 'foo',
        source: { field: 1 },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 1 },
        num: { value: 0 },
        bool: { value: false }
      },
      {
        value: 'foo',
        source: { field: 1 },
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
    }, null, { fields });
    expect(m).to.eql([
      { value: 'SE', source: { field: 0 }, num: { value: 3, source: { field: 1 } } },
      { value: 'IT', source: { field: 0 }, num: { value: 7, source: { field: 1 } } },
      { value: 'SE', source: { field: 0 }, num: { value: 2, source: { field: 1 } } }
    ]);
  });

  it('should return collected values', () => {
    const m = extract({
      field: 0,
      trackBy: v => v,
      props: {
        item: { field: 1 }
      }
    }, null, { fields });
    expect(m).to.eql([
      {
        item: { value: [3, 2], source: { field: 1 } }
      },
      {
        item: { value: [7], source: { field: 1 } }
      }
    ]);
  });

  it('should return reduced values', () => {
    const ffs = [
      { items: () => ['SE', 'IT', 'SE', 'SE', 'SE'] },
      { items: () => [5, 25, 4, 8, 7] }
    ];
    const m = extract({
      field: 0,
      trackBy: v => v,
      props: {
        item: { reduce: 'first' },
        min: { field: 1, reduce: 'min' },
        max: { field: 1, reduce: 'max' },
        sum: { field: 1, reduce: 'sum' },
        avg: { field: 1, reduce: 'avg' },
        first: { field: 1, reduce: 'first' },
        last: { field: 1, reduce: 'last' }
      }
    }, null, { fields: ffs });
    expect(m).to.eql([
      {
        item: { value: 'SE', source: { field: 0 } },
        min: { value: 4, source: { field: 1 } },
        max: { value: 8, source: { field: 1 } },
        sum: { value: 24, source: { field: 1 } },
        avg: { value: 6, source: { field: 1 } },
        first: { value: 5, source: { field: 1 } },
        last: { value: 7, source: { field: 1 } }
      },
      {
        item: { value: 'IT', source: { field: 0 } },
        min: { value: 25, source: { field: 1 } },
        max: { value: 25, source: { field: 1 } },
        sum: { value: 25, source: { field: 1 } },
        avg: { value: 25, source: { field: 1 } },
        first: { value: 25, source: { field: 1 } },
        last: { value: 25, source: { field: 1 } }
      }
    ]);
  });
});
