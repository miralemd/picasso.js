
import lineComponent from '../../../../../src/core/chart-components/grid/line';

describe('line marker', () => {
  let line;
  let renderedPoints;
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
        render: p => (renderedPoints = p),
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

  it('should not render lines with default settings and no scales', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' }
    };

    composer.dataset().map.returns([{}]);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([]);
  });

  it('should render lines with default settings and scales', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      x: { scale: 'x' },
      y: { scale: 'y' }
    };

    composer.dataset().map.returns([{}]);

    const xScale = v => v;
    xScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: false
    }];
    composer.scale.onCall(0).returns(xScale);

    const yScale = v => v;
    yScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: false
    }];
    composer.scale.onCall(1).returns(yScale);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        vertical: false,
        x1: 49.5,
        x2: 49.5,
        y1: -0.5,
        y2: 199.5
      },
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        vertical: true,
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

    composer.dataset().map.returns([{}]);

    const xScale = v => v;
    xScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: false
    }];
    composer.scale.onCall(0).returns(xScale);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        vertical: false,
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

    composer.dataset().map.returns([{}]);

    const yScale = v => v;
    yScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: false
    }];
    composer.scale.onCall(0).returns(yScale);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([
      {
        stroke: '#cccccc',
        strokeWidth: 1,
        type: 'line',
        vertical: true,
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
      styles: {
        minorTicks: {
          show: true
        }
      }
    };

    composer.dataset().map.returns([{}]);

    const xScale = v => v;
    xScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: true
    }];
    composer.scale.onCall(0).returns(xScale);

    const yScale = v => v;
    yScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: true
    }];
    composer.scale.onCall(1).returns(yScale);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([
      {
        stroke: '#E6E6E6',
        strokeWidth: 1,
        type: 'line',
        vertical: false,
        x1: 49.5,
        x2: 49.5,
        y1: -0.5,
        y2: 199.5
      },
      {
        stroke: '#E6E6E6',
        strokeWidth: 1,
        type: 'line',
        vertical: true,
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
      styles: {
        minorTicks: {
          show: false
        },
        ticks: {
          show: false
        }
      }
    };

    composer.dataset().map.returns([{}]);

    const xScale = v => v;
    xScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: true
    }];
    composer.scale.onCall(0).returns(xScale);

    const yScale = v => v;
    yScale.cachedTicks = () => [{
      position: 0.5,
      isMinor: false
    }];
    composer.scale.onCall(1).returns(yScale);

    line = lineComponent(config, composer);

    line.resize({ x: 10, y: 20, width: 100, height: 200 });
    line.render();

    expect(renderedPoints).to.deep.equal([]);
  });
});