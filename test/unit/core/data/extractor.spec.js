import extract from '../../../../src/core/data/extractor';

describe('extract data', () => {
  const country = {
    items: () => [
      { v: 3, s: 'A' },
      { v: 4, s: 'B' }
    ],
    value: d => d.v,
    label: d => d.s
  };

  describe('from config as array', () => {
    it('should normalize values', () => {
      expect(extract(['A', 'B', 'C']).items).to.eql([
        { value: 'A' },
        { value: 'B' },
        { value: 'C' }
      ]);
    });
  });

  describe('from items as array', () => {
    it('should normalize values', () => {
      expect(extract({
        items: ['A', 'B', 'C']
      }).items).to.eql([
        { value: 'A' },
        { value: 'B' },
        { value: 'C' }
      ]);
    });
  });

  describe('from items as array with custom accessors', () => {
    it('should normalize values', () => {
      expect(extract({
        items: [{ v: 3, s: 'A' }, { v: 5, s: 'B' }, { v: 7, s: 'C' }],
        value: d => d.v
      }).items).to.eql([
        { value: 3 },
        { value: 5 },
        { value: 7 }
      ]);
    });
  });

  describe('from dataset', () => {
    it('should normalize field values using default field accessors', () => {
      const dataset = () => ({
        field: () => country
      });
      let d = extract({
        field: 'dim'
      }, { dataset });

      expect(d.items).to.eql([
        { value: 3, source: { field: 'dim' } },
        { value: 4, source: { field: 'dim' } }
      ]);
    });

    it('should return the source fields', () => {
      const dataset = () => ({
        field: () => country,
        extract: () => [1, 2]
      });
      let d = extract({
        extract: [{ field: 'dim' }]
      }, { dataset });

      expect(d.items).to.eql([1, 2]);
      expect(d.fields).to.eql([country]);
    });

    it('should normalize field values using custom accessors', () => {
      const dataset = () => ({
        field: () => country
      });
      let d = extract({
        field: 'dim',
        value: x => x.v + 5
      }, { dataset });

      expect(d.items).to.eql([
        { value: 8, source: { field: 'dim' } },
        { value: 9, source: { field: 'dim' } }
      ]);
    });
  });

  describe('from collection', () => {
    it('should return a collection', () => {
      let collection = sinon.stub().withArgs('nyckel').returns('my collection');
      let d = extract({
        collection: 'nyckel'
      }, { collection });

      expect(d).to.equal('my collection');
    });
  });
});
