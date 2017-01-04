import GeoCircle from '../../../../src/core/geometry/circle';
import { convertRectToPoints } from '../../../../src/core/math/intersection';

describe('GeoCircle', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const c = new GeoCircle();

      expect(c.cx).to.equal(0);
      expect(c.cy).to.equal(0);
      expect(c.r).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const c = new GeoCircle(1, 2, 3);

      expect(c.cx).to.equal(1);
      expect(c.cy).to.equal(2);
      expect(c.r).to.equal(3);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const c = new GeoCircle();
      c.set(7, 8, 9);

      expect(c.cx).to.equal(7);
      expect(c.cy).to.equal(8);
      expect(c.r).to.equal(9);
    });
  });

  describe('Intersection', () => {
    describe('Point', () => {
      it('should intersect with a point inside its circumference ', () => {
        const r = 30;
        const c = new GeoCircle(10, 20, r);
        const rInside = r - 1;
        const p1 = { x: 10, y: 20 - rInside };
        const p2 = { x: 10 + rInside, y: 20 };
        const p3 = { x: 10, y: 20 + rInside };
        const p4 = { x: 10 - rInside, y: 20 };

        expect(c.containsPoint(p1)).to.equal(true);
        expect(c.containsPoint(p2)).to.equal(true);
        expect(c.containsPoint(p3)).to.equal(true);
        expect(c.containsPoint(p4)).to.equal(true);
      });

      it('should not intersect with a point outside its circumference ', () => {
        const r = 30;
        const c = new GeoCircle(10, 20, r);
        const rOutside = r + 1;
        const p1 = { x: 10, y: 20 - rOutside };
        const p2 = { x: 10 + rOutside, y: 20 };
        const p3 = { x: 10, y: 20 + rOutside };
        const p4 = { x: 10 - rOutside, y: 20 };

        expect(c.containsPoint(p1)).to.equal(false);
        expect(c.containsPoint(p2)).to.equal(false);
        expect(c.containsPoint(p3)).to.equal(false);
        expect(c.containsPoint(p4)).to.equal(false);
      });

      it('should intersect with a point on its circumference', () => {
        const r = 30;
        const c = new GeoCircle(10, 20, r);
        const p1 = { x: 10, y: 20 - r };
        const p2 = { x: 10 + r, y: 20 };
        const p3 = { x: 10, y: 20 + r };
        const p4 = { x: 10 - r, y: 20 };

        expect(c.containsPoint(p1)).to.equal(true);
        expect(c.containsPoint(p2)).to.equal(true);
        expect(c.containsPoint(p3)).to.equal(true);
        expect(c.containsPoint(p4)).to.equal(true);
      });
    });

    describe('Rect', () => {
      it('should intersect if circle coordinate is on rect circumference', () => {
        const r = 30;
        const c1 = new GeoCircle(0, 0, r);
        const c2 = new GeoCircle(100, 0, r);
        const c3 = new GeoCircle(0, 200, r);
        const c4 = new GeoCircle(100, 200, r);
        const rect = convertRectToPoints({ x: 0, y: 0, width: 100, height: 200 });

        expect(c1.intersectsRect(rect)).to.equal(true);
        expect(c2.intersectsRect(rect)).to.equal(true);
        expect(c3.intersectsRect(rect)).to.equal(true);
        expect(c4.intersectsRect(rect)).to.equal(true);
      });

      it('should intersect if rect is inside circle circumference', () => {
        const r = 300;
        const c1 = new GeoCircle(100, 100, r);
        const rect = convertRectToPoints({ x: 150, y: 150, width: 50, height: 50 });

        expect(c1.intersectsRect(rect)).to.equal(true);
      });

      it('should intersect if circle coordinate is inside rect circumference', () => {
        const r = 30;
        const c1 = new GeoCircle(50, 1, r);
        const c2 = new GeoCircle(99, 100, r);
        const c3 = new GeoCircle(50, 199, r);
        const c4 = new GeoCircle(1, 100, r);
        const rect = convertRectToPoints({ x: 0, y: 0, width: 100, height: 200 });

        expect(c1.intersectsRect(rect)).to.equal(true);
        expect(c2.intersectsRect(rect)).to.equal(true);
        expect(c3.intersectsRect(rect)).to.equal(true);
        expect(c4.intersectsRect(rect)).to.equal(true);
      });

      it('should intersect if circle circumference is inside rect', () => {
        const r = 30;
        const c1 = new GeoCircle(0, -r, r);
        const c2 = new GeoCircle(100 + r, 0, r);
        const c3 = new GeoCircle(0, 200 + r, r);
        const radiusDist = Math.floor(Math.cos((45 / 180) * Math.PI) * r);
        const c4 = new GeoCircle(100 + radiusDist, 200 + radiusDist, r);
        const rect = convertRectToPoints({ x: 0, y: 0, width: 100, height: 200 });

        expect(c1.intersectsRect(rect)).to.equal(true);
        expect(c2.intersectsRect(rect)).to.equal(true);
        expect(c3.intersectsRect(rect)).to.equal(true);
        expect(c4.intersectsRect(rect)).to.equal(true);
      });

      it('should not intersect if circle circumference is outside rect', () => {
        const r = 30;
        const rr = r + 1;
        const c1 = new GeoCircle(0, -rr, r);
        const c2 = new GeoCircle(100 + rr, 0, r);
        const c3 = new GeoCircle(0, 200 + rr, r);
        const radiusDist = Math.cos((45 / 180) * Math.PI) * rr;
        const c4 = new GeoCircle(100 + radiusDist, 200 + radiusDist, r);
        const rect = convertRectToPoints({ x: 0, y: 0, width: 100, height: 200 });

        expect(c1.intersectsRect(rect)).to.equal(false);
        expect(c2.intersectsRect(rect)).to.equal(false);
        expect(c3.intersectsRect(rect)).to.equal(false);
        expect(c4.intersectsRect(rect)).to.equal(false);
      });
    });

    describe('Line', () => {
      it('should intersect with a vertical line passing through the circle', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 90, y: 0 };
        const p2 = { x: 90, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should intersect with a vertical line passing through the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 70, y: 0 };
        const p2 = { x: 70, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should not intersect with a vertical line outside the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 69, y: 0 };
        const p2 = { x: 69, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(false);
      });

      it('should intersect with a horizontal line passing through the circle', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 190 };
        const p2 = { x: 300, y: 190 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should intersect with a horizontal line passing through the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 170 };
        const p2 = { x: 300, y: 170 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should not intersect with a horizontal line outside the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 169 };
        const p2 = { x: 300, y: 169 };

        expect(c.intersectsLine([p1, p2])).to.equal(false);
      });

      it('should intersect with a diagonal line passing through the circle', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 90 };
        const p2 = { x: 150, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should intersect with a diagonal line passing through the circle circumference', () => {
        const r = 36;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 150 };
        const p2 = { x: 150, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should not intersect with a diagonal line outside the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 90 };
        const p2 = { x: 100, y: 300 };

        expect(c.intersectsLine([p1, p2])).to.equal(false);
      });

      it('should intersect with a coincident diagonal line of longer magnitude', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 200, y: 400 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should not intersect with a coincident diagonal line of shorten magnitude', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 50, y: 100 };

        expect(c.intersectsLine([p1, p2])).to.equal(false);
      });

      it('should intersect with a line that has start point inside the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 105, y: 205 };
        const p2 = { x: 200, y: 400 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });

      it('should intersect with a line that has end point inside the circle circumference', () => {
        const r = 30;
        const c = new GeoCircle(100, 200, r);
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 90, y: 190 };

        expect(c.intersectsLine([p1, p2])).to.equal(true);
      });
    });
  });
});
