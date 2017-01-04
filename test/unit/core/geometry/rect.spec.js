import GeoRect from '../../../../src/core/geometry/rect';

describe('GeoRect', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const r = new GeoRect();

      expect(r.x).to.equal(0);
      expect(r.y).to.equal(0);
      expect(r.width).to.equal(0);
      expect(r.height).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const r = new GeoRect(10, 20, 100, 50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative width correctly', () => {
      const r = new GeoRect(10, 20, -100, 50);

      expect(r.x).to.equal(-90);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative height correctly', () => {
      const r = new GeoRect(10, 20, 100, -50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(-30);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const r = new GeoRect();
      r.set(10, 20, 100, 50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative width correctly', () => {
      const r = new GeoRect();
      r.set(10, 20, -100, 50);

      expect(r.x).to.equal(-90);
      expect(r.y).to.equal(20);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });

    it('should handle negative height correctly', () => {
      const r = new GeoRect();
      r.set(10, 20, 100, -50);

      expect(r.x).to.equal(10);
      expect(r.y).to.equal(-30);
      expect(r.width).to.equal(100);
      expect(r.height).to.equal(50);
    });
  });

  describe('points', () => {
    it('should return the correct points', () => {
      const r = new GeoRect(10, 20, 100, 50);
      const points = r.points();

      expect(points.length).to.equal(4);
      expect(points[0]).to.deep.equal({ x: 10, y: 20 });
      expect(points[1]).to.deep.equal({ x: 110, y: 20 });
      expect(points[2]).to.deep.equal({ x: 110, y: 70 });
      expect(points[3]).to.deep.equal({ x: 10, y: 70 });
    });
  });

  describe('Intersection', () => {
    describe('Point', () => {
      it('should intersect if point is within the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const p = { x: 100, y: 200 };
        expect(r.containsPoint(p)).to.equal(true);
      });

      it('should intersect if point is on the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const p = { x: 50, y: 100 };
        expect(r.containsPoint(p)).to.equal(true);
      });

      it('should not intersect if point is outside the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const p1 = { x: 49, y: 100 };
        const p2 = { x: 50, y: 99 };
        const p3 = { x: 201, y: 300 };
        const p4 = { x: 200, y: 301 };

        expect(r.containsPoint(p1)).to.equal(false);
        expect(r.containsPoint(p2)).to.equal(false);
        expect(r.containsPoint(p3)).to.equal(false);
        expect(r.containsPoint(p4)).to.equal(false);
      });
    });

    describe('Rect', () => {
      it('should intersect if circumferences are crossing', () => {
        const r = new GeoRect(100, 200, 300, 400);
        const collider = new GeoRect(150, 250, 300, 400);
        expect(r.intersectsRect(collider.points())).to.equal(true);
      });

      it('should intersect if circumferences are touching', () => {
        const r = new GeoRect(100, 200, 300, 400);
        const collider = new GeoRect(400, 600, 300, 400);
        expect(r.intersectsRect(collider.points())).to.equal(true);
      });

      it('should intersect if target rect is contained within the circumference', () => {
        const r = new GeoRect(100, 200, 300, 400);
        const collider = new GeoRect(150, 250, 50, 100);
        expect(r.intersectsRect(collider.points())).to.equal(true);
      });

      it('should not intersect if circumferences are not crossing', () => {
        const r = new GeoRect(100, 200, 300, 400);
        const collider = new GeoRect(401, 601, 100, 200);
        expect(r.intersectsRect(collider.points())).to.equal(false);
      });
    });

    describe('Line', () => {
      it('should intersect if a parrallel vertical line is crossing the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 70, y: 0 }, { x: 70, y: 400 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if a parrallel horizontal line is crossing the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 0, y: 250 }, { x: 250, y: 250 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if diagonal line is crossing the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 0, y: 0 }, { x: 250, y: 400 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if line is inside the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 100, y: 250 }, { x: 150, y: 250 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if a line point is inside the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points1 = [{ x: 100, y: 250 }, { x: 250, y: 250 }];
        const points2 = [{ x: 0, y: 250 }, { x: 150, y: 250 }];

        expect(r.intersectsLine(points1)).to.equal(true);
        expect(r.intersectsLine(points2)).to.equal(true);
      });

      it('should intersect if a line is on the circumference', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 50, y: 100 }, { x: 200, y: 100 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if a line start point is on the circumference and points outwards', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 50, y: 100 }, { x: 0, y: 0 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });

      it('should intersect if a line end point is on the circumference and points outwards', () => {
        const r = new GeoRect(50, 100, 150, 200);
        const points = [{ x: 0, y: 0 }, { x: 50, y: 100 }];

        expect(r.intersectsLine(points)).to.equal(true);
      });
    });
  });
});
