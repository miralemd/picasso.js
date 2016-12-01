import shapeFn from '../../../../../src/core/chart-components/markers/point/shapes';

describe('point shapes', () => {
  let p;
  beforeEach(() => {
    p = {
      label: 'foo',
      x: 50,
      y: 70,
      fill: 'red',
      size: 10,
      stroke: 'green',
      strokeWidth: 5,
      opacity: 0.5
    };
  });

  it('should create a circle by default', () => {
    expect(shapeFn('blabla', {}).type).to.equal('circle');
  });

  it('should create a circle', () => {
    expect(shapeFn('circle', p)).to.deep.equal({
      type: 'circle',
      title: 'foo',
      cx: 50,
      cy: 70,
      fill: 'red',
      r: 5,
      stroke: 'green',
      strokeWidth: 5,
      opacity: 0.5
    });
  });

  it('should create a rect', () => {
    expect(shapeFn('rect', p)).to.deep.equal({
      type: 'rect',
      title: 'foo',
      x: 45,
      y: 65,
      width: 10,
      height: 10,
      fill: 'red',
      stroke: 'green',
      strokeWidth: 5,
      opacity: 0.5
    });
  });
});
