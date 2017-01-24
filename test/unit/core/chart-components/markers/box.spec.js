
import boxMarker from '../../../../../src/core/chart-components/markers/box';

describe('box marker', () => {
  let box;
  let rendererOutput;
  let composer;
  let shapeFn;

  beforeEach(() => {
    const table = {
      findField: sinon.stub()
    };
    const dataset = {
      map: sinon.stub()
    };
    shapeFn = (type, p) => { p.type = type; return p; };
    composer = {
      renderer: {
        appendTo: () => {},
        render: p => (rendererOutput = p),
        size: () => {}
      },
      brush: () => ({
        on: () => {}
      }),
      container: () => ({}),
      table: () => table,
      dataset: () => dataset,
      scale: sinon.stub()
    };
  });

  it('should not render boxes with default settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' }
    };

    composer.dataset().map.returns([{}]);

    box = boxMarker(config, composer);

    box.resize({ x: 10, y: 20, width: 100, height: 200 });
    box.render();

    expect(rendererOutput).to.deep.equal([]);
  });

  it('should render a single basic box with minor custom settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        x: { scale: 'x' },
        y: { scale: 'y' },
        box: {
          stroke: '#f00'
        },
        whisker: {
          stroke: '#0f0'
        },
        median: {
          stroke: '#00f'
        },
        line: {
          stroke: '#ff0'
        }
      }
    };

    composer.dataset().map.returns([{
      self: 0.5,
      min: 0.2,
      start: 0.4,
      med: 0.5,
      end: 0.6,
      max: 0.8
    }]);

    const xScale = v => v;
    xScale.step = () => 0.5;
    const yScale = v => v;
    yScale.step = () => 0.5;
    composer.scale.onCall(0).returns(xScale);
    composer.scale.onCall(1).returns(yScale);

    box = boxMarker(config, composer);

    box.resize({ x: 10, y: 20, width: 100, height: 200 });
    box.render();

    expect(rendererOutput).to.deep.equal([{
      data: 0,
      show: true,
      stroke: '#ff0',
      strokeWidth: 1,
      type: 'line',
      x1: 49.5,
      x2: 49.5,
      y1: 79.5,
      y2: 39.5
    },
    {
      data: 0,
      show: true,
      stroke: '#ff0',
      strokeWidth: 1,
      type: 'line',
      x1: 49.5,
      x2: 49.5,
      y1: 159.5,
      y2: 119.5
    },
    {
      data: 0,
      fill: '#fff',
      height: 40,
      maxWidth: 100,
      minWidth: 5,
      show: true,
      stroke: '#f00',
      strokeWidth: 1,
      type: 'rect',
      width: 38,
      x: 31.5,
      y: 79.5
    },
    {
      data: 0,
      show: true,
      stroke: '#00f',
      strokeWidth: 1,
      type: 'line',
      x1: 31.5,
      x2: 68.5,
      y1: 99.5,
      y2: 99.5
    },
    {
      cx: 50,
      cy: 40,
      data: 0,
      fill: '',
      r: 12.5,
      show: true,
      stroke: '#0f0',
      strokeWidth: 1,
      type: 'line',
      width: 25,
      x1: 37.5,
      x2: 62.5,
      y1: 39.5,
      y2: 39.5
    },
    {
      cx: 50,
      cy: 160,
      data: 0,
      fill: '',
      r: 12.5,
      show: true,
      stroke: '#0f0',
      strokeWidth: 1,
      type: 'line',
      width: 25,
      x1: 37.5,
      x2: 62.5,
      y1: 159.5,
      y2: 159.5
    }]);
  });
});
