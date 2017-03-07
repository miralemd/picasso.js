
import componentFactory from '../../../../../src/core/component/component-factory';
import pointComponent from '../../../../../src/core/chart-components/markers/point/point';

describe('point marker', () => {
  let renderedPoints;
  let chart;
  let renderer;
  let shapeFn;

  function createAndRenderPoint(opts) {
    const {
      inner,
      outer,
      config
    } = opts;
    const component = componentFactory(pointComponent, {
      settings: config,
      chart,
      renderer
    });
    component.beforeMount();
    component.resize(inner, outer);
    component.mounted();
    component.beforeRender();
    component.render();
    component.mounted();
    return component;
  }

  beforeEach(() => {
    const table = {
      findField: sinon.stub()
    };
    const dataset = {
      map: sinon.stub()
    };
    shapeFn = (type, p) => { p.type = type; return p; };
    chart = {
      brush: () => ({
        on: () => {}
      }),
      container: () => ({}),
      table: () => table,
      dataset: () => dataset,
      scale: sinon.stub()
    };
    renderer = {
      appendTo: () => {},
      render: p => (renderedPoints = p),
      size: () => {}
    };
  });

  it('should render points with default settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' }
    };
    chart.dataset().map.returns([{}]);
    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });
    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: '',
      x: 50,
      y: 100,
      fill: '#999',
      size: 10,
      stroke: '#ccc',
      strokeWidth: 0,
      opacity: 1,
      data: 0
    }]);
  });

  it('should render points with default settings when settings properties are invalid', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      settings: {
        shape: 1,
        label: true,
        fill: 123,
        opacity: 'red',
        x: false,
        y: true
      }
    };
    chart.dataset().map.returns([{}]);
    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });
    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: '',
      x: 50,
      y: 100,
      fill: '#999',
      size: 10,
      stroke: '#ccc',
      strokeWidth: 0,
      opacity: 1,
      data: 0
    }]);
  });


  it('should render points with primitive value settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      settings: {
        shape: 'rect',
        label: 'etikett',
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        opacity: 0.7,
        x: 0.8,
        y: 0.3,
        size: 4
      }
    };
    chart.dataset().map.returns([{}]);
    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });
    expect(renderedPoints).to.deep.equal([{
      type: 'rect',
      label: 'etikett',
      x: 80,
      y: 60,
      fill: 'red',
      size: 37,
      stroke: 'blue',
      strokeWidth: 2,
      opacity: 0.7,
      data: 0
    }]);
  });

  it('should render points with function settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter', groupBy: 'does not matter' },
      settings: {
        shape() { return this.data.label; },
        label: () => 'etikett',
        fill: () => 'red',
        stroke: () => 'blue',
        strokeWidth: () => 2,
        opacity: () => 0.7,
        x: () => 0.8,
        y: () => 0.3,
        size: () => 4
      }
    };
    chart.dataset().map.returns([{
      label: 'a'
    }]);
    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });
    expect(renderedPoints).to.deep.equal([{
      type: 'a',
      label: 'etikett',
      x: 80,
      y: 60,
      fill: 'red',
      size: 37,
      stroke: 'blue',
      strokeWidth: 2,
      opacity: 0.7,
      data: 0
    }]);
  });

  it('should render points with data settings', () => {
    const config = {
      shapeFn,
      data: { mapTo: 'does not matter since returned data is mocked', groupBy: 'does not matter' },
      settings: {
        shape: { ref: 'shape', fn: s => s },
        label: { ref: 'label', fn: s => s },
        fill() { return this.data.fill; },
        stroke: { ref: 'fill', fn: s => `stroke:${s}` },
        strokeWidth: { ref: 'm1', fn: v => v },
        opacity: { ref: 'm1', fn: v => v / 10 },
        x: { fn() { return this.data.m2; } },
        y: { ref: 'm3', fn: v => v },
        size: { ref: 'm1', fn: (v, i) => i },
        minSize: 0 // Set here to avoid hitting the limit
      }
    };

    chart.dataset().map.returns([{
      label: 'etta',
      shape: 'circle',
      fill: 'red',
      m1: 5,
      m2: -0.2,
      m3: 0.3
    }, {
      label: 'tvåa',
      shape: 'rect',
      fill: 'green',
      m1: 4,
      m2: 0.7,
      m3: 1.2
    }]);

    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 },
      config
    });
    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: 'etta',
      x: -0.2 * 100,
      y: 0.3 * 200,
      fill: 'red',
      size: 1, // min value of [1,10]
      stroke: 'stroke:red',
      strokeWidth: 5,
      opacity: 0.5,
      data: 0
    }, {
      type: 'rect',
      label: 'tvåa',
      x: 0.7 * 100,
      y: 1.2 * 200,
      fill: 'green',
      size: 10, // max value of [1,10]
      stroke: 'stroke:green',
      strokeWidth: 4,
      opacity: 0.4,
      data: 1
    }]);
  });

  it('should render points with limited size when using discrete scale', () => {
    const config = {
      shapeFn,
      data: { mapTo: '', groupBy: '' },
      settings: {
        x: { scale: 'whatever', ref: 'm1', fn: v => v.value },
        size: { ref: 'm1', fn: v => v.value },
        minSize: 0
      }
    };
    // chart.table().findField.withArgs('foo').returns({ values: () => ['data 1', 'data 2', 'data 3'] });
    // chart.table().findField.withArgs('measure 1').returns({ values: () => [0, 0.4, 1] });
    chart.dataset().map.returns([
      { m1: { value: 0 } },
      { m1: { value: 0.4 } },
      { m1: { value: 1 } }
    ]);
    const xScale = v => v;
    xScale.bandWidth = () => 0.2; // max size: width * 0.2 -> 20
    chart.scale.onCall(0).returns(xScale);

    createAndRenderPoint({
      inner: { x: 10, y: 20, width: 100, height: 200 }, // point size limits: [2,20]
      config
    });

    expect(renderedPoints.map(p => p.size)).to.deep.equal([2, 2 + (18 * 0.4), 20]);
  });
});
