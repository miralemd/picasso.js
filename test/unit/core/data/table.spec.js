import table from '../../../../src/core/data/table';

describe('table', () => {
  describe('defaults', () => {
    let dd;
    beforeEach(() => {
      dd = table()([
        ['Country', 'Population'],
        ['Sweden', 123],
        ['Norway', -345]
      ]);
    });

    it('should find 2 fields', () => {
      expect(dd.fields().length).to.equal(2);
    });

    it('should have nice titles on fields', () => {
      expect(dd.fields().map(f => f.title())).to.eql(['Country', 'Population']);
    });

    it('should extract values from fields', () => {
      expect(dd.fields().map(f => f.values())).to.eql([
        [{ id: 'Sweden', label: 'Sweden', value: 'Sweden' }, { id: 'Norway', label: 'Norway', value: 'Norway' }],
        [{ id: '123', label: '123', value: 123 }, { id: '-345', label: '-345', value: -345 }]
      ]);
    });
  });

  describe('with custom accessors', () => {
    let dd;
    const fieldsFn = (tableData) => {
      const fieldFn = fieldData => ({
        values: fieldData.values,
        title: fieldData.title
      });
      return tableData.foo.map(fieldFn);
    };
    beforeEach(() => {
      dd = table({
        fields: fieldsFn
      })({
        foo: [
          { title: 'First field', values: [0, 5, 6] },
          { title: 'Second field', values: [1, 2] }
        ]
      });
    });

    it('should find 2 fields', () => {
      expect(dd.fields().length).to.eql(2);
    });

    it('should have nice titles on fields', () => {
      expect(dd.fields().map(f => f.title)).to.eql(['First field', 'Second field']);
    });

    it('should extract values from fields', () => {
      expect(dd.fields().map(f => f.values)).to.eql([[0, 5, 6], [1, 2]]);
    });
  });
});
