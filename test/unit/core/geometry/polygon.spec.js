import { create } from '../../../../src/core/geometry/polygon';

describe('GeoPolygon', () => {
  let polygon;
  const convexPolygon = [
    { x: 0, y: 25 },
    { x: 25, y: 0 },
    { x: 50, y: 25 },
    { x: 0, y: 25 }
  ]; // Triangle
  const concavePolygon = [
    { x: 0, y: 0 },
    { x: 0, y: 50 },
    { x: 25, y: 25 },
    { x: 50, y: 50 },
    { x: 50, y: 0 },
    { x: 0, y: 0 }
  ];
  const selfIntersectingPolygon = [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 50, y: 0 },
    { x: 0, y: 50 },
    { x: 0, y: 0 }
  ]; // butterfly quadrilateral

  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      polygon = create();
      expect(polygon.vertices).to.deep.equal([]);
      expect(polygon.edges).to.deep.equal([]);
    });

    it('should set the correct values when arguments passed', () => {
      polygon = create({ vertices: convexPolygon });
      expect(polygon.vertices).to.deep.equal(convexPolygon);
      expect(polygon.edges).to.deep.equal([
        [{ x: 0, y: 25 }, { x: 25, y: 0 }],
        [{ x: 25, y: 0 }, { x: 50, y: 25 }],
        [{ x: 50, y: 25 }, { x: 0, y: 25 }]
      ]);
    });

    it('should close edges if not already closed', () => {
      polygon = create({
        vertices: [
          { x: 0, y: 25 },
          { x: 25, y: 0 },
          { x: 50, y: 25 }
        ]
      });
      expect(polygon.vertices).to.deep.equal([
        { x: 0, y: 25 },
        { x: 25, y: 0 },
        { x: 50, y: 25 },
        { x: 0, y: 25 }
      ]);
    });
  });

  describe('set', () => {
    it('should set correct default values when no arguments passed', () => {
      polygon = create({ vertices: convexPolygon });
      polygon.set();
      expect(polygon.vertices).to.deep.equal([]);
      expect(polygon.edges).to.deep.equal([]);
    });

    it('should set the correct values when arguments passed', () => {
      polygon = create();
      polygon.set({ vertices: convexPolygon });
      expect(polygon.vertices).to.deep.equal(convexPolygon);
      expect(polygon.edges).to.deep.equal([
        [{ x: 0, y: 25 }, { x: 25, y: 0 }],
        [{ x: 25, y: 0 }, { x: 50, y: 25 }],
        [{ x: 50, y: 25 }, { x: 0, y: 25 }]
      ]);
    });
  });

  describe('bounds', () => {
    it('should return the correct bounds', () => {
      polygon = create({ vertices: selfIntersectingPolygon });
      expect(polygon.bounds()).to.deep.equal([
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
        { x: 0, y: 50 }
      ]);
    });

    it('should handle negative points', () => {
      polygon = create({ vertices: [
        { x: -20, y: -10 },
        { x: 0, y: -10 },
        { x: 20, y: 10 }
      ] });
      expect(polygon.bounds()).to.deep.equal([
        { x: -20, y: -10 },
        { x: 20, y: -10 },
        { x: 20, y: 10 },
        { x: -20, y: 10 }
      ]);
    });
  });

  describe('Intersection', () => {
    describe('Point', () => {
      it('convex polygon', () => {
        const inside = { x: 25, y: 12.5 }; // "center" of triangle
        const outside = { x: 75, y: 12.5 }; // "right" side of triangle

        polygon = create({ vertices: convexPolygon });
        expect(polygon.containsPoint(inside)).to.equal(true);
        expect(polygon.containsPoint(outside)).to.equal(false);
      });

      it('concave polygon', () => {
        const outside = { x: 25, y: 35 };
        const inside = { x: 25, y: 25 };

        polygon = create({ vertices: concavePolygon });
        expect(polygon.containsPoint(inside)).to.equal(true);
        expect(polygon.containsPoint(outside)).to.equal(false);
      });

      it('self-Intersecting polygon', () => {
        const outside = { x: 25, y: 15 }; // in the concave area
        const inside = { x: 35, y: 25 }; // on a polygon edge in the concave area
        const atCross = { x: 25, y: 25 };

        polygon = create({ vertices: selfIntersectingPolygon });
        expect(polygon.containsPoint(inside)).to.equal(true);
        expect(polygon.containsPoint(outside)).to.equal(false);
        expect(polygon.containsPoint(atCross)).to.equal(true);
      });

      it('should not intersect if polygon contains less then 2 vertices', () => {
        const p = { x: 10, y: 10 };

        polygon = create({
          vertices: [
            { x: 10, y: 10 }
          ]
        });
        expect(polygon.containsPoint(p)).to.equal(false);
      });
    });

    describe('intersectsCircle', () => {
      it('convex polygon', () => {
        const inside = { cx: 25, cy: 12.5, r: 2 }; // "center" of triangle
        const outside = { cx: 75, cy: 12.5, r: 2 }; // "right" side of triangle
        const circleCircumferenceIntersects = { cx: 1, cy: 1, r: 25 };

        polygon = create({ vertices: convexPolygon });
        expect(polygon.intersectsCircle(inside)).to.equal(true);
        expect(polygon.intersectsCircle(outside)).to.equal(false);
        expect(polygon.intersectsCircle(circleCircumferenceIntersects)).to.equal(true);
      });

      it('concave polygon', () => {
        const inside = { cx: 25, cy: 12.5, r: 2 }; // "center" of triangle
        const outside = { cx: 75, cy: 12.5, r: 2 }; // "right" side of triangle
        const circleCircumferenceIntersects = { cx: 75, cy: 25, r: 35 };

        polygon = create({ vertices: concavePolygon });
        expect(polygon.intersectsCircle(inside)).to.equal(true);
        expect(polygon.intersectsCircle(outside)).to.equal(false);
        expect(polygon.intersectsCircle(circleCircumferenceIntersects)).to.equal(true);
      });

      it('self-Intersecting polygon', () => {
        const inside = { cx: 35, cy: 25, r: 2 }; // "center" of triangle
        const outside = { cx: 25, cy: 12.5, r: 2 }; // "right" side of triangle
        const circleCircumferenceIntersects = { cx: 25, cy: 12.5, r: 12 };

        polygon = create({ vertices: selfIntersectingPolygon });
        expect(polygon.intersectsCircle(inside)).to.equal(true);
        expect(polygon.intersectsCircle(outside)).to.equal(false);
        expect(polygon.intersectsCircle(circleCircumferenceIntersects)).to.equal(true);
      });

      it('should not intersect if polygon contains less then 2 vertices', () => {
        const c = { cx: 0, cy: 0, r: 2 };

        polygon = create({
          vertices: [
            { x: 0, y: 0 }
          ]
        });
        expect(polygon.intersectsCircle(c)).to.equal(false);
      });
    });
  });
});
