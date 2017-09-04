import dataset from '../../../../src/core/data/dataset';

describe('dataset', () => {
  describe('api', () => {
    let d;
    before(() => {
      d = dataset();
    });
    it('#field', () => {
      expect(d.field).to.be.a('function');
    });

    it('#raw', () => {
      expect(d.raw).to.be.a('function');
    });

    it('#extract', () => {
      expect(d.extract).to.be.a('function');
    });

    it('#hierarchy', () => {
      expect(d.hierarchy).to.be.a('function');
    });
  });

  describe('field()', () => {
    let d;
    before(() => {
      const data = [
        ['Product', 'Sales'],
        ['Cars', 56],
        ['Cars', 59]
      ];
      d = dataset(data);
    });

    it('should find the second field', () => {
      const f = d.field(1);
      expect(f.title()).to.equal('Sales');
      expect(f.items()).to.eql([56, 59]);
    });
  });
});
