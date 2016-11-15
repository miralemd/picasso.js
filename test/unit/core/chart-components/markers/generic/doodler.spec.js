/* eslint no-unused-expressions: 0*/

import doodler from '../../../../../../src/core/chart-components/markers/generic/doodler';

describe('Doodler', () => {
  let doodle;
  let latestPush;

  beforeEach(() => {
    doodle = doodler();
    latestPush = null;
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

  it('should doodle vertical lines correctly with custom push function', () => {
    doodle.push = (v) => { latestPush = v; };

    doodle.verticalLine(1, 2, 3, 'line2');

    expect(latestPush).to.eql({
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
