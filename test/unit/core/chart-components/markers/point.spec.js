import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import pointComponent from '../../../../../src/core/chart-components/markers/point/point';

describe('point marker', () => {
  let renderedPoints;
  let chart;
  let shapeFn;
  let componentFixture;
  let opts;

  beforeEach(() => {
    // const table = {
    //   findField: sinon.stub()
    // };
    // const dataset = {
    //   map: sinon.stub()
    // };
    opts = {
      inner: { x: 10, y: 20, width: 100, height: 200 }
    };
    shapeFn = p => p;
    componentFixture = componentFactoryFixture();
    chart = componentFixture.mocks().chart;
    // chart.dataset.returns(dataset);
    // chart.table.returns(table);
    // chart.dataset().map.returns([{}]);
  });

  it('should render points with default settings', () => {
    const config = {
      shapeFn,
      data: [{}]
    };

    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: '',
      x: 50,
      y: 100,
      fill: '#333333',
      size: 10,
      stroke: '#ccc',
      strokeWidth: 0,
      strokeDasharray: '',
      opacity: 1,
      data: { value: {} }
    }]);
  });

  it('should render points with default settings when settings properties are invalid', () => {
    const config = {
      shapeFn,
      data: [{}],
      settings: {
        shape: 1,
        label: true,
        fill: 123,
        size: 'random',
        opacity: 'red',
        x: false,
        y: true
      }
    };

    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: '',
      x: 50,
      y: 100,
      fill: '#333333',
      size: 10,
      stroke: '#ccc',
      strokeWidth: 0,
      strokeDasharray: '',
      opacity: 1,
      data: { value: {} }
    }]);
  });


  it('should render points with primitive value settings', () => {
    const config = {
      shapeFn,
      data: [{}],
      settings: {
        shape: 'rect',
        label: 'etikett',
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        strokeDasharray: '2 5',
        opacity: 0.7,
        x: 0.8,
        y: 0.3,
        size: 0,
        sizeLimits: {
          minRelExtent: 0.2,
          maxRelExtent: 1
        }
      }
    };

    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints).to.deep.equal([{
      type: 'square',
      label: 'etikett',
      x: 80,
      y: 60,
      fill: 'red',
      size: 20,
      stroke: 'blue',
      strokeWidth: 2,
      strokeDasharray: '2 5',
      opacity: 0.7,
      data: { value: {} }
    }]);
  });

  it('should render points with function settings', () => {
    const config = {
      shapeFn,
      data: ['a'],
      settings: {
        shape() { return this.data.value; },
        label: () => 'etikett',
        fill: () => 'red',
        stroke: () => 'blue',
        strokeWidth: () => 2,
        strokeDasharray: () => '3 5',
        opacity: () => 0.7,
        x: () => 0.8,
        y: () => 0.3,
        size: () => 1,
        sizeLimits: {
          maxRelExtent: 0.5 // 50% of min(width, height)
        }
      }
    };
    // chart.dataset().map.returns([{
    //   label: 'a'
    // }]);
    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints).to.deep.equal([{
      type: 'a',
      label: 'etikett',
      x: 80,
      y: 60,
      fill: 'red',
      size: 50,
      stroke: 'blue',
      strokeWidth: 2,
      strokeDasharray: '3 5',
      opacity: 0.7,
      data: {
        value: 'a'
      }
    }]);
  });

  it('should render points with data settings', () => {
    const config = {
      shapeFn,
      data: [{
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
      }],
      settings: {
        shape: { ref: 'value', fn: s => s.shape },
        label: { ref: 'value', fn: s => s.label },
        fill() { return this.data.value.fill; },
        stroke: { ref: 'value', fn: s => `stroke:${s.fill}` },
        strokeWidth: { ref: 'value', fn: v => v.m1 },
        strokeDasharray: { ref: 'value', fn: s => s.label },
        opacity: { ref: 'value', fn: v => v.m1 / 10 },
        x: { fn() { return this.data.value.m2; } },
        y: { ref: 'value', fn: v => v.m3 },
        size: { ref: 'value', fn: (v, i) => i },
        sizeLimits: {
          minRelExtent: 0.2,
          maxRelExtent: 2
        }
      }
    };

    // chart.dataset().map.returns([{
    //   label: 'etta',
    //   shape: 'circle',
    //   fill: 'red',
    //   m1: 5,
    //   m2: -0.2,
    //   m3: 0.3
    // }, {
    //   label: 'tvåa',
    //   shape: 'rect',
    //   fill: 'green',
    //   m1: 4,
    //   m2: 0.7,
    //   m3: 1.2
    // }]);

    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints).to.deep.equal([{
      type: 'circle',
      label: 'etta',
      x: -0.2 * 100,
      y: 0.3 * 200,
      fill: 'red',
      size: 20, // value of minRel * min(width, height)
      stroke: 'stroke:red',
      strokeWidth: 5,
      strokeDasharray: 'etta',
      opacity: 0.5,
      data: { value: {
        label: 'etta',
        shape: 'circle',
        fill: 'red',
        m1: 5,
        m2: -0.2,
        m3: 0.3
      } }
    }, {
      type: 'square',
      label: 'tvåa',
      x: 0.7 * 100,
      y: 1.2 * 200,
      fill: 'green',
      size: 200, // value of maxRel * min(width, height)
      stroke: 'stroke:green',
      strokeWidth: 4,
      strokeDasharray: 'tvåa',
      opacity: 0.4,
      data: { value: {
        label: 'tvåa',
        shape: 'rect',
        fill: 'green',
        m1: 4,
        m2: 0.7,
        m3: 1.2
      } }
    }]);
  });

  it('should render points with limited size when using discrete scale', () => {
    const config = {
      shapeFn,
      data: [0, 0.4, 1],
      settings: {
        x: { scale: 'whatever', ref: 'value', fn: v => v },
        size: { ref: 'value', fn: v => v },
        sizeLimits: {
          maxRelDiscrete: 2,
          minRelDiscrete: 0.5,
          maxRelExtent: 100,
          minRelExtent: 100
        }
      }
    };
    // chart.table().findField.withArgs('foo').returns({ values: () => ['data 1', 'data 2', 'data 3'] });
    // chart.table().findField.withArgs('measure 1').returns({ values: () => [0, 0.4, 1] });
    // chart.dataset().map.returns([
    //   { m1: { value: 0 } },
    //   { m1: { value: 0.4 } },
    //   { m1: { value: 1 } }
    // ]);
    const xScale = v => v;
    xScale.bandwidth = () => 0.2; // max size: width * 0.2 * maxRelDiscrete -> 40, // min size: width * 0.2 * minRelDiscrete -> 10
    chart.scale.onCall(0).returns(xScale);

    componentFixture.simulateCreate(pointComponent, config);
    renderedPoints = componentFixture.simulateRender(opts);

    expect(renderedPoints.map(p => p.size)).to.deep.equal([10, 10 + (30 * 0.4), 40]);
  });
});
