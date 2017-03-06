
import componentFactory from '../../../../../src/core/component/component-factory';
import boxMarker from '../../../../../src/core/chart-components/markers/box/box';
import { create } from '../../../../../src/core/charts/scales';

describe('box marker', () => {
  let rendererOutput;
  let chart;
  let shapeFn;

  beforeEach(() => {
    const table = {
      findField: sinon.stub()
    };
    const dataset = {
      map: sinon.stub()
    };
    shapeFn = (type, p) => { p.type = type; return p; };
    chart = {
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

  function createAndRenderComponent(opts) {
    const {
      config,
      inner
    } = opts;
    const instance = componentFactory(boxMarker)(config, chart);
    instance.beforeMount();
    instance.resize(inner);
    instance.beforeRender();
    instance.render();
    instance.mounted();
    return instance;
  }

  it('should not render boxes with default settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' }
    };

    chart.dataset().map.returns([{}]);

    createAndRenderComponent({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });

    expect(rendererOutput).to.deep.equal([]);
  });

  it('should render a single basic box with minor custom settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        major: { scale: 'x' },
        minor: { scale: 'y' },
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

    chart.dataset().map.returns([{
      self: 0.5,
      min: 0.2,
      start: 0.4,
      med: 0.5,
      end: 0.6,
      max: 0.8
    }]);

    const xScale = v => v;
    xScale.bandWidth = () => 0.5;
    const yScale = v => v;
    yScale.bandWidth = () => 0.5;
    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);

    createAndRenderComponent({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });

    expect(rendererOutput).to.deep.equal([
      {
        type: 'container',
        data: 0,
        collider: {
          type: 'bounds'
        },
        children: [
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
            width: 50,
            x: 49.5,
            y: 79.5,
            collider: {
              type: null
            }
          },
          {
            data: 0,
            show: true,
            stroke: '#ff0',
            strokeWidth: 1,
            type: 'line',
            x1: 74.5,
            x2: 74.5,
            y1: 79.5,
            y2: 39.5,
            collider: {
              type: null
            }
          },
          {
            data: 0,
            show: true,
            stroke: '#ff0',
            strokeWidth: 1,
            type: 'line',
            x1: 74.5,
            x2: 74.5,
            y1: 159.5,
            y2: 119.5,
            collider: {
              type: null
            }
          },
          {
            data: 0,
            show: true,
            stroke: '#00f',
            strokeWidth: 1,
            type: 'line',
            x1: 49.5,
            x2: 99.5,
            y1: 99.5,
            y2: 99.5,
            collider: {
              type: null
            }
          },
          {
            cx: 75,
            cy: 40,
            data: 0,
            fill: '',
            r: 25,
            show: true,
            stroke: '#0f0',
            strokeWidth: 1,
            type: 'line',
            width: 50,
            x1: 49.5,
            x2: 99.5,
            y1: 39.5,
            y2: 39.5,
            collider: {
              type: null
            }
          },
          {
            cx: 75,
            cy: 160,
            data: 0,
            fill: '',
            r: 25,
            show: true,
            stroke: '#0f0',
            strokeWidth: 1,
            type: 'line',
            width: 50,
            x1: 49.5,
            x2: 99.5,
            y1: 159.5,
            y2: 159.5,
            collider: {
              type: null
            }
          }
        ]
      }
    ]);
  });

  it('should accept only end variable and draw a simple bar chart', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        major: { scale: 'x' },
        minor: { scale: 'y' },
        box: {
          stroke: '#f00'
        }
      }
    };

    chart.dataset().map.returns([{
      self: 0.5,
      start: 0,
      end: 0.6
    }]);

    const xScale = v => v;
    xScale.bandWidth = () => 0.5;
    const yScale = v => v;
    yScale.bandWidth = () => 0.5;
    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);

    createAndRenderComponent({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });

    expect(rendererOutput).to.deep.equal([
      {
        type: 'container',
        data: 0,
        collider: {
          type: 'bounds'
        },
        children: [
          {
            data: 0,
            fill: '#fff',
            height: 120,
            maxWidth: 100,
            minWidth: 5,
            show: true,
            stroke: '#f00',
            strokeWidth: 1,
            type: 'rect',
            width: 50,
            x: 49.5,
            y: -0.5,
            collider: {
              type: null
            }
          }
        ]
      }
    ]);
  });

  it('should accept start and end variable to draw a gantt chart', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        major: { scale: 'x' },
        minor: { scale: 'y' },
        box: {
          stroke: '#f00'
        }
      }
    };

    chart.dataset().map.returns([{
      self: 0.5,
      start: 0.2,
      end: 0.6
    }]);

    const xScale = v => v;
    xScale.bandWidth = () => 0.5;
    const yScale = v => v;
    yScale.bandWidth = () => 0.5;
    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);

    createAndRenderComponent({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });

    expect(rendererOutput).to.deep.equal([
      {
        type: 'container',
        data: 0,
        collider: {
          type: 'bounds'
        },
        children: [
          {
            data: 0,
            fill: '#fff',
            height: 80,
            maxWidth: 100,
            minWidth: 5,
            show: true,
            stroke: '#f00',
            strokeWidth: 1,
            type: 'rect',
            width: 50,
            x: 49.5,
            y: 39.5,
            collider: {
              type: null
            }
          }
        ]
      }
    ]);
  });

  it('should accept start, end, min and max values, without whiskers', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        major: { scale: 'x' },
        minor: { scale: 'y' },
        box: {
          stroke: '#f00'
        },
        whisker: {
          show: false
        }
      }
    };

    chart.dataset().map.returns([{
      self: 0.5,
      start: 0.4,
      end: 0.6,
      min: 0.2,
      max: 0.8
    }]);

    const xScale = v => v;
    xScale.bandWidth = () => 0.5;
    const yScale = v => v;
    yScale.bandWidth = () => 0.5;
    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);

    createAndRenderComponent({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });

    expect(rendererOutput).to.deep.equal([
      {
        type: 'container',
        data: 0,
        collider: {
          type: 'bounds'
        },
        children: [
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
            width: 50,
            x: 49.5,
            y: 79.5,
            collider: {
              type: null
            }
          },
          {
            data: 0,
            show: true,
            stroke: '#000',
            strokeWidth: 1,
            type: 'line',
            x1: 74.5,
            x2: 74.5,
            y1: 79.5,
            y2: 39.5,
            collider: {
              type: null
            }
          },
          {
            data: 0,
            show: true,
            stroke: '#000',
            strokeWidth: 1,
            type: 'line',
            x1: 74.5,
            x2: 74.5,
            y1: 159.5,
            y2: 119.5,
            collider: {
              type: null
            }
          }
        ]
      }
    ]);
  });

  it('should not have the squeeze bug', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        major: { scale: 'x' },
        minor: { scale: 'y' },
        box: {
          stroke: '#f00'
        },
        whisker: {
          show: false
        }
      }
    };

    let dataset = [
      {
        self: { value: 1 },
        start: { value: 0.4 },
        end: { value: 0.6 },
        min: { value: 0.2 },
        max: { value: 0.8 }
      },
      {
        self: { value: 2 },
        start: { value: 0.4 },
        end: { value: 0.6 },
        min: { value: 0.2 },
        max: { value: 0.8 }
      },
      {
        self: { value: 3 },
        start: { value: 0.4 },
        end: { value: 0.6 },
        min: { value: 0.2 },
        max: { value: 0.8 }
      },
      {
        self: { value: 4 },
        start: { value: 0.4 },
        end: { value: 0.6 },
        min: { value: 0.2 },
        max: { value: 0.8 }
      },
      {
        self: { value: 5 },
        start: { value: 0.4 },
        end: { value: 0.6 },
        min: { value: 0.2 },
        max: { value: 0.8 }
      }
    ];

    chart.dataset().map.returns(dataset);

    const xScale = create({ type: 'ordinal' });
    xScale.domain([1, 2, 3, 4, 5]);
    const yScale = create({ min: 0.2, max: 0.8 });

    chart.scale.withArgs({ scale: 'x' }).returns(xScale);
    chart.scale.withArgs({ scale: 'y' }).returns(yScale);

    createAndRenderComponent({
      inner: { x: 0, y: 0, width: 200, height: 20 },
      config
    });

    const items = [
      {
        type: 'rect',
        x: -0.5,
        y: 6.5,
        height: 7,
        width: 40,
        show: true,
        fill: '#fff',
        stroke: '#f00',
        strokeWidth: 1,
        maxWidth: 100,
        minWidth: 5,
        data: 0,
        collider: {
          type: null
        }
      },
      {
        type: 'rect',
        x: 40.5,
        y: 6.5,
        height: 7,
        width: 40,
        show: true,
        fill: '#fff',
        stroke: '#f00',
        strokeWidth: 1,
        maxWidth: 100,
        minWidth: 5,
        data: 1,
        collider: {
          type: null
        }
      },
      {
        type: 'rect',
        x: 79.5,
        y: 6.5,
        height: 7,
        width: 40,
        show: true,
        fill: '#fff',
        stroke: '#f00',
        strokeWidth: 1,
        maxWidth: 100,
        minWidth: 5,
        data: 2,
        collider: {
          type: null
        }
      },
      {
        type: 'rect',
        x: 120.5,
        y: 6.5,
        height: 7,
        width: 40,
        show: true,
        fill: '#fff',
        stroke: '#f00',
        strokeWidth: 1,
        maxWidth: 100,
        minWidth: 5,
        data: 3,
        collider: {
          type: null
        }
      },
      {
        type: 'rect',
        x: 159.5,
        y: 6.5,
        height: 7,
        width: 40,
        show: true,
        fill: '#fff',
        stroke: '#f00',
        strokeWidth: 1,
        maxWidth: 100,
        minWidth: 5,
        data: 4,
        collider: {
          type: null
        }
      }
    ];

    const children = rendererOutput.map(c => c.children);
    const rects = [].concat(...children).filter(o => o.type === 'rect');
    expect(rects).to.deep.equal(items);
  });
});
