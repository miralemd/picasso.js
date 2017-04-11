import { rectCollidesWithRect } from '../../../../src/core/math/intersection';

describe('Intersection', () => {
  describe('rectCollidesWithRect', () => {
    it('should not collide 1', () => {
      let result = rectCollidesWithRect(
        { x: 3, y: 25, width: 100, height: 200 },
        { x: 104, y: 226, width: 12, height: 14 }
      );

      expect(result).to.be.false;
    });

    it('should not collide 2', () => {
      let result = rectCollidesWithRect(
        { x: 104, y: 226, width: 12, height: 14 },
        { x: 3, y: 25, width: 100, height: 200 }
      );

      expect(result).to.be.false;
    });

    it('should collide 1', () => {
      let result = rectCollidesWithRect(
        { x: 14, y: 26, width: 100, height: 140 },
        { x: 3, y: 28, width: 90, height: 196 }
      );

      expect(result).to.be.true;
    });

    it('should collide 2', () => {
      let result = rectCollidesWithRect(
        { x: 50, y: 28, width: 90, height: 196 },
        { x: 2, y: 26, width: 800, height: 92 }
      );

      expect(result).to.be.true;
    });
  });
});
