import field from '../../../../src/core/data/field';

describe('Field', () => {
  let f;
  beforeEach(() => {
    f = field();
  });

  describe('defaults', () => {
    const dd = {
      min: 1,
      max: 2,
      tags: ['a', 'b'],
      title: 'wohoo',
      values: ['a', 'c', 'a']
    };
    beforeEach(() => {
      f.data(dd);
    });

    it('should return data', () => {
      expect(f.data()).to.deep.equal(dd);
    });

    it('should return min value', () => {
      expect(f.min()).to.equal(1);
    });

    it('should return max value', () => {
      expect(f.max()).to.equal(2);
    });

    it('should return tags', () => {
      expect(f.tags()).to.deep.equal(['a', 'b']);
    });

    it('should return title', () => {
      expect(f.title()).to.equal('wohoo');
    });

    it('should return values', () => {
      expect(f.values()).to.deep.equal(['a', 'c', 'a']);
    });
  });

  describe('custom accessors', () => {
    beforeEach(() => {
      f.data({
        mm: { qMin: -3, maximum: 2 },
        meta: {
          taggar: [{ v: 'numeric' }, { v: 'date' }]
        },
        label: 'custom',
        values: [{ v: 1 }, { v: 6 }, { v: 6 }]
      });
    });

    it('should return min value', () => {
      expect(f.min(d => d.mm.qMin).min()).to.equal(-3);
    });

    it('should return max value', () => {
      expect(f.max(d => d.mm.maximum).max()).to.equal(2);
    });

    it('should return tags', () => {
      expect(f.tags(d => d.meta.taggar.map(x => x.v)).tags()).to.deep.equal(['numeric', 'date']);
    });

    it('should return title', () => {
      expect(f.title(d => d.label).title()).to.equal('custom');
    });

    it('should return values', () => {
      expect(f.values(d => d.values.map(x => x.v)).values()).to.deep.equal([1, 6, 6]);
    });
  });
});
