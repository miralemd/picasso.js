
import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import lineComponent from '../../../../../src/core/chart-components/grid/line';

describe('line marker', () => {
  let rendererOutput;
  let chart;
  let shapeFn;
  let componentFixture;
  let opts;
  let xScale;
  let yScale;
  let xTick;
  let yTick;

  beforeEach(() => {
    xTick = {
      position: 0.5,
      isMinor: false
    };
    yTick = {
      position: 0.5,
      isMinor: false
    };
    xScale = {
      cachedTicks: () => [xTick]
    };
    yScale = {
      cachedTicks: () => [yTick]
    };

    opts = {
      inner: { x: 10, y: 20, width: 100, height: 200 }
    };

    componentFixture = componentFactoryFixture();

    chart = componentFixture.mocks().chart;
    chart.dataset = () => ({
      map: componentFixture.sandbox().stub()
    });
    chart.dataset().map.returns([{}]);
    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);
  });

  it('should not render lines with default settings and no scales', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' }
    };

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([]);
  });

  it('should render lines with default settings and scales', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      x: { scale: 'x' },
      y: { scale: 'y' }
    };

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        flipXY: false,
        x1: 49.5,
        x2: 49.5,
        y1: -0.5,
        y2: 199.5
      },
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        flipXY: true,
        x1: -0.5,
        x2: 99.5,
        y1: 99.5,
        y2: 99.5
      }
    ]);
  });

  it('should render X scale lines only', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      x: { scale: 'x' }
    };

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        flipXY: false,
        x1: 49.5,
        x2: 49.5,
        y1: -0.5,
        y2: 199.5
      }
    ]);
  });

  it('should render Y scale lines only', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      y: { scale: 'y' }
    };

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        flipXY: true,
        x1: -0.5,
        x2: 99.5,
        y1: 99.5,
        y2: 99.5
      }
    ]);
  });

  it('should render minorTicks', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      x: { scale: 'x' },
      y: { scale: 'y' },
      minorTicks: {
        show: true
      }
    };

    xTick.isMinor = true;
    yTick.isMinor = true;

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([
      {
        stroke: '#E6E6E6',
        strokeWidth: 1,
        type: 'line',
        flipXY: false,
        x1: 49.5,
        x2: 49.5,
        y1: -0.5,
        y2: 199.5
      },
      {
        stroke: '#E6E6E6',
        strokeWidth: 1,
        type: 'line',
        flipXY: true,
        x1: -0.5,
        x2: 99.5,
        y1: 99.5,
        y2: 99.5
      }
    ]);
  });

  it('should not render disabled ticks', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      x: { scale: 'x' },
      y: { scale: 'y' },
      minorTicks: {
        show: false
      },
      ticks: {
        show: false
      }
    };

    xTick.isMinor = true;

    componentFixture.simulateCreate(lineComponent, config);
    rendererOutput = componentFixture.simulateRender(opts);

    expect(rendererOutput).to.deep.equal([]);
  });
});
