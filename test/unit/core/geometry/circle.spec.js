import Circle from '../../../../src/core/geometry/circle';

describe('Circle', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const c = new Circle();

      expect(c.cx).to.equal(0);
      expect(c.cy).to.equal(0);
      expect(c.r).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const c = new Circle(1, 2, 3);

      expect(c.cx).to.equal(1);
      expect(c.cy).to.equal(2);
      expect(c.r).to.equal(3);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const c = new Circle();
      c.set(7, 8, 9);

      expect(c.cx).to.equal(7);
      expect(c.cy).to.equal(8);
      expect(c.r).to.equal(9);
    });
  });
});
