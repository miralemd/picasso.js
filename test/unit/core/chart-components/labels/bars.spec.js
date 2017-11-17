import {
  getBarRect
} from '../../../../../src/core/chart-components/labels/strategies';

function place(position, direction) {
  return getBarRect({
    bar: { x: 10, y: 40, width: 20, height: 30 },
    view: { width: 200, height: 100 },
    direction,
    position,
    padding: 2
  });
}

describe('labeling - bars', () => {
  describe('bar rects', () => {
    it('inside', () => {
      expect(place('inside')).to.eql({ x: 12, y: 42, width: 16, height: 26 });
    });

    it('outside-up/opposite-down', () => {
      expect(place('outside', 'up')).to.eql({ x: 12, y: 2, width: 16, height: 36 });
      expect(place('opposite', 'down')).to.eql({ x: 12, y: 2, width: 16, height: 36 });
    });

    it('outside-down/opposite-up', () => {
      expect(place('outside', 'down')).to.eql({ x: 12, y: 72, width: 16, height: 26 });
      expect(place('opposite', 'up')).to.eql({ x: 12, y: 72, width: 16, height: 26 });
    });

    it('outside-right/opposite-left', () => {
      expect(place('outside', 'right')).to.eql({ x: 32, y: 42, width: 166, height: 26 });
      expect(place('opposite', 'left')).to.eql({ x: 32, y: 42, width: 166, height: 26 });
    });

    it('outside-left/opposite-right', () => {
      expect(place('outside', 'left')).to.eql({ x: 2, y: 42, width: 6, height: 26 });
      expect(place('opposite', 'right')).to.eql({ x: 2, y: 42, width: 6, height: 26 });
    });
  });
});
