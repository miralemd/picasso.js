import Line from '../../../../src/core/geometry/line';

describe('Line', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const l = new Line();

      expect(l.x1).to.equal(0);
      expect(l.y1).to.equal(0);
      expect(l.x2).to.equal(0);
      expect(l.y2).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const l = new Line(1, 2, 3, 4);

      expect(l.x1).to.equal(1);
      expect(l.y1).to.equal(2);
      expect(l.x2).to.equal(3);
      expect(l.y2).to.equal(4);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const l = new Line();
      l.set(6, 7, 8, 9);

      expect(l.x1).to.equal(6);
      expect(l.y1).to.equal(7);
      expect(l.x2).to.equal(8);
      expect(l.y2).to.equal(9);
    });
  });

  describe('points', () => {
    it('should return the correct points', () => {
      const l = new Line(5, 6, 7, 8),
        points = l.points();

      expect(points[0]).to.deep.equal({ x: 5, y: 6 });
      expect(points[1]).to.deep.equal({ x: 7, y: 8 });
    });
  });
});
