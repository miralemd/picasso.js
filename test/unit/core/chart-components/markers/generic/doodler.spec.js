/* eslint no-unused-expressions: 0*/

import doodler from '../../../../../../src/core/chart-components/markers/generic/doodler';

describe('Doodler', () => {
  let doodle;

  beforeEach(() => {
    doodle = doodler();
  });

  it('should doodle horizontal lines correctly', () => {
    expect(doodle.horizontalLine(1, 2, 3, 'line1', { line1: { stroke: 2 } })).to.eql({
      type: 'line',
      y1: 2,
      x1: 1 - (3 / 2),
      y2: 2,
      x2: 1 + (3 / 2),
      stroke: 2
    });
  });

  it('should doodle vertical lines correctly', () => {
    expect(doodle.verticalLine(1, 2, 3, 'line2')).to.eql({
      type: 'line',
      y1: 2,
      x1: 1,
      y2: 3,
      x2: 1
    });
  });

  it('should doodle normal whiskers correctly', () => {
    const whisker = doodle.whisker(1, 2);

    expect(whisker.type).to.eql('line');
    expect(whisker.y1).to.eql(2);
  });

  it('should doodle open whiskers correctly', () => {
    const whisker = doodle.openwhisker(1, 2);

    expect(whisker.type).to.eql('line');
    expect(whisker.y1).to.eql(2);
  });

  it('should doodle open whiskers correctly', () => {
    const whisker = doodle.closewhisker(1, 2);

    expect(whisker.type).to.eql('line');
    expect(whisker.y1).to.eql(2);
  });

  it('should doodle median correctly', () => {
    const median = doodle.median(1, 2);

    expect(median.type).to.eql('line');
    expect(median.y1).to.eql(2);
  });

  it('should doodle a box correctly', () => {
    expect(doodle.box(1, 2, 3)).to.eql(
      {
        type: 'rect',
        x: 1 - (1 / 2),
        y: 2,
        height: 3,
        width: 1
      }
    );
  });
});
