import { minmax, angleToPoints, toRadians, degreesToPoints } from '../../../../src/core/utils/math';

describe('minmax', () => {
  it('should default to [0,1]', () => {
    expect(minmax()).to.eql([0, 1]);
    expect(minmax({})).to.eql([0, 1]);
  });

  it('should use provided min value', () => {
    expect(minmax({
      min: 13
    })).to.eql([13, 1]);
  });

  it('should use provided max value', () => {
    expect(minmax({
      max: 13
    })).to.eql([0, 13]);
  });

  it('should calculate min from object array', () => {
    let arr = [
      { min: () => 4 },
      { min: () => 3 }
    ];
    expect(minmax({ max: 15 }, arr)).to.eql([3, 15]);
  });

  it('should calculate max from object array', () => {
    let arr = [
      { max: () => 4 },
      { max: () => 3 }
    ];
    expect(minmax({ min: -4 }, arr)).to.eql([-4, 4]);
  });

  it('should handle NaN values in object array', () => {
    let arr = [
      { min: () => 'min', max: () => 'max' }
    ];
    expect(minmax({}, arr)).to.eql([0, 1]);
  });

  describe('angleToPoints', () => {
    it('should respond with correct values', () => {
      let result1 = angleToPoints(toRadians(90));

      expect(result1.x1).to.be.closeTo(1, 0.0000001);
      expect(result1.y1).to.be.closeTo(0, 0.0000001);
      expect(result1.x2).to.be.closeTo(1, 0.0000001);
      expect(result1.y2).to.be.closeTo(1, 0.0000001);

      let result2 = angleToPoints(toRadians(180));

      expect(result2.x1).to.be.closeTo(0, 0.0000001);
      expect(result2.y1).to.be.closeTo(0, 0.0000001);
      expect(result2.x2).to.be.closeTo(1, 0.0000001);
      expect(result2.y2).to.be.closeTo(0, 0.0000001);
    });
  });

  describe('degreesToPoints', () => {
    it('should respond with correct values', () => {
      let result1 = degreesToPoints(45);

      expect(result1.x1).to.be.closeTo(1, 0.0000001);
      expect(result1.y1).to.be.closeTo(0, 0.0000001);
      expect(result1.x2).to.be.closeTo(0, 0.0000001);
      expect(result1.y2).to.be.closeTo(1, 0.0000001);

      let result2 = degreesToPoints(0);

      expect(result2.x1).to.be.closeTo(1, 0.0000001);
      expect(result2.y1).to.be.closeTo(0, 0.0000001);
      expect(result2.x2).to.be.closeTo(0, 0.0000001);
      expect(result2.y2).to.be.closeTo(0, 0.0000001);
    });
  });
});
