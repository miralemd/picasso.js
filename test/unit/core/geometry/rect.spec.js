import Rect from '../../../../src/core/geometry/rect';

describe('rect', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const r = new Rect();

      expect(r.x).to.equal(0);
      expect(r.y).to.equal(0);
      expect(r.width).to.equal(0);
      expect(r.height).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const r = new Rect(10, 20, 100, 50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative width correctly', () => {
      const r = new Rect(10, 20, -100, 50);

      expect(r.x).to.equal(-90);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative height correctly', () => {
      const r = new Rect(10, 20, 100, -50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(-30);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const r = new Rect();
      r.set(10, 20, 100, 50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative width correctly', () => {
      const r = new Rect();
      r.set(10, 20, -100, 50);

      expect(r.x).to.equal(-90);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative height correctly', () => {
      const r = new Rect();
      r.set(10, 20, 100, -50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(-30);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });
  });

  describe('points', () => {
    it('should return the correct points', () => {
      const r = new Rect(10, 20, 100, 50),
        points = r.points();

      expect(points.length).to.equal(4);
      expect(points[0]).to.deep.equal({ x: 10, y: 20 });
      expect(points[1]).to.deep.equal({ x: 110, y: 20 });
      expect(points[2]).to.deep.equal({ x: 110, y: 70 });
      expect(points[3]).to.deep.equal({ x: 10, y: 70 });
    });
  });
});
