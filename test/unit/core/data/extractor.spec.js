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

  const region = {
    items: () => [
      { v: 7 },
      { v: 9 }
    ],
    value: d => d.v
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

    it('should return the source fields of the extracted data', () => {
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

    it('should return the source fields', () => {
      const dataset = () => ({
        field: () => country,
        extract: () => [1, 2]
      });
      let d = extract({
        fields: ['dim', 'dim']
      }, { dataset });

      expect(d.fields).to.eql([country, country]);
    });

    it('should return the source fields from multiple sources', () => {
      const dOne = {
        field: () => country
      };
      const dTwo = {
        field: () => region
      };
      const datasetFn = sinon.stub();
      datasetFn.withArgs('one').returns(dOne);
      datasetFn.withArgs('two').returns(dTwo);

      let d = extract({
        fields: [{
          source: 'one',
          field: 'dim'
        }, {
          source: 'two',
          field: 'foo'
        }]
      }, { dataset: datasetFn });
      expect(d.fields.length).to.equal(2);
    });

    it('should extract from multiple data sources', () => {
      const dOne = {
        field: () => country,
        extract: () => ['A', 'B']
      };
      const dTwo = {
        field: () => region,
        extract: () => ['K', 'L']
      };
      const datasetFn = sinon.stub();
      datasetFn.withArgs('one').returns(dOne);
      datasetFn.withArgs('two').returns(dTwo);

      let d = extract({
        extract: [{
          source: 'one',
          field: 'dim'
        }, {
          source: 'two',
          field: 'foo'
        }]
      }, { dataset: datasetFn });
      expect(d.items).to.eql(['A', 'B', 'K', 'L']);
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
