import range from '../../../../src/core/brush/range-collection';

describe('range-collection', () => {
  describe('api', () => {
    it('should be a factory function', () => {
      expect(range).to.be.a('function');
    });

    it('instance should be a function', () => {
      expect(range()).to.be.a('function');
    });
  });

  describe('add', () => {
    let r;
    beforeEach(() => {
      r = range();
    });
    it('should handle a simple range', () => {
      r.add({ min: -2, max: 4 });
      expect(r.ranges()).to.eql([{ min: -2, max: 4 }]);
    });

    it('should handle multiple ranges', () => {
      r.add({ min: -2, max: 4 });
      r.add({ min: 10, max: 11 });
      r.add({ min: -6, max: -3 });
      expect(r.ranges()).to.eql([
        { min: -6, max: -3 },
        { min: -2, max: 4 },
        { min: 10, max: 11 }
      ]);
    });

    it('should handle multiple overlapping ranges', () => {
      r.add({ min: -2, max: 4 });
      r.add({ min: -1, max: 7 });
      r.add({ min: -4, max: -2 });
      r.add({ min: 30, max: 50 });
      expect(r.ranges()).to.eql([
        { min: -4, max: 7 },
        { min: 30, max: 50 }
      ]);
    });
  });

  describe('remove', () => {
    let r;
    beforeEach(() => {
      r = range();
      r.add({ min: -10, max: 20 });
    });
    it('should break a continuous range into multiple', () => {
      r.remove({ min: -2, max: 4 });
      expect(r.ranges()).to.eql([
        { min: -10, max: -2 },
        { min: 4, max: 20 }
      ]);
    });

    it('should change the span of the range collection', () => {
      r.remove({ min: -15, max: -5 });
      r.remove({ min: 18, max: 24 });
      expect(r.ranges()).to.eql([
        { min: -5, max: 18 }
      ]);
    });
  });

  describe('clear', () => {
    let r;
    beforeEach(() => {
      r = range();
    });
    it('should clear all ranges', () => {
      r.add({ min: -2, max: 4 });
      expect(r.ranges()).to.eql([{ min: -2, max: 4 }]);
      r.clear();
      expect(r.ranges()).to.eql([]);
    });
  });

  describe('containsValue', () => {
    let r;
    beforeEach(() => {
      r = range();
      r.add({ min: -10, max: 20 });
      r.add({ min: 50, max: 60 });
    });

    it('should return false for values outside the range', () => {
      expect(r.containsValue(-11)).to.equal(false);
      expect(r.containsValue(25)).to.equal(false);
      expect(r.containsValue(70)).to.equal(false);
    });

    it('should return true for values inside a range', () => {
      expect(r.containsValue(-10)).to.equal(true);
      expect(r.containsValue(0)).to.equal(true);
      expect(r.containsValue(20)).to.equal(true);
      expect(r.containsValue(50)).to.equal(true);
      expect(r.containsValue(55)).to.equal(true);
    });
  });
});
