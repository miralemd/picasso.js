import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import axisComponent from '../../../../../src/core/chart-components/axis/axis';
import linear from '../../../../../src/core/scales/linear';
import band from '../../../../../src/core/scales/band';

describe('Axis', () => {
  let config;
  let scale = {};
  let componentFixture;
  let opts;
  let chart;

  function verifyNumberOfNodes(type, expectedNbrOfNodes) {
    const nodes = componentFixture.getRenderOutput().filter(n => n.type === type);

    expect(nodes.length, `Unexpected number of ${type} nodes`).to.equal(expectedNbrOfNodes);
  }

  beforeEach(() => {
    componentFixture = componentFactoryFixture();

    chart = componentFixture.mocks().chart;
    chart.scale.returns(scale);

    config = {
      scale: 'y',
      formatter: 'f',
      settings: {}
    };

    opts = {
      inner: { x: 0, y: 0, width: 100, height: 100 },
      outer: { x: 0, y: 0, width: 100, height: 100 }
    };
  });

  describe('Lifecycle', () => {
    describe('Update', () => {
      it('should handle an update where scale type changes from discrete to continuous', () => {
        scale = band();
        scale.domain([0, 1, 2, 3, 4, 5]);
        chart.scale.returns(scale);
        config.settings.labels = { show: true };

        componentFixture.simulateCreate(axisComponent, config);
        componentFixture.simulateRender(opts);

        verifyNumberOfNodes('text', 6);

        chart.scale.returns(linear());
        componentFixture.simulateUpdate();
        verifyNumberOfNodes('text', 3);
      });

      it('should handle an update where scale type changes from continuous to discrete', () => {
        scale = linear();
        chart.scale.returns(scale);
        config.settings.labels = { show: true };

        componentFixture.simulateCreate(axisComponent, config);
        componentFixture.simulateRender(opts);

        verifyNumberOfNodes('text', 3);

        scale = band();
        scale.domain([0, 1, 2, 3, 4, 5]);
        chart.scale.returns(scale);
        componentFixture.simulateUpdate();
        verifyNumberOfNodes('text', 6);
      });
    });
  });

  describe('continuous', () => {
    beforeEach(() => {
      scale = linear();
      chart.scale.returns(scale);
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        componentFixture.simulateCreate(axisComponent, config);
        componentFixture.simulateRender(opts);

        verifyNumberOfNodes('text', 3);
        verifyNumberOfNodes('line', 4);
      });
    });

    it('should not render labels when disabled', () => {
      config.settings.labels = { show: false };
      componentFixture.simulateCreate(axisComponent, config);
      componentFixture.simulateRender(opts);

      verifyNumberOfNodes('text', 0);
      verifyNumberOfNodes('line', 4);
    });

    it('should not render axis line when disabled', () => {
      config.settings.line = { show: false };
      componentFixture.simulateCreate(axisComponent, config);
      componentFixture.simulateRender(opts);

      verifyNumberOfNodes('text', 3);
      verifyNumberOfNodes('line', 3);
    });

    it('should not render ticks when disabled', () => {
      config.settings.ticks = { show: false };
      componentFixture.simulateCreate(axisComponent, config);
      componentFixture.simulateRender(opts);

      verifyNumberOfNodes('text', 3);
      verifyNumberOfNodes('line', 1);
    });
  });

  describe('discrete', () => {
    beforeEach(() => {
      scale = band();
      scale.domain([0, 1, 2]);
      scale.range([0, 1]);
      chart.scale.returns(scale);
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        componentFixture.simulateCreate(axisComponent, config);
        componentFixture.simulateRender(opts);

        verifyNumberOfNodes('text', 3);
        verifyNumberOfNodes('line', 0);
      });
    });

    ['top', 'bottom'].forEach((d) => {
      it(`should support layered labels for ${d} aligned axis`, () => {
        config.settings.align = d;
        config.settings.labels = { mode: 'layered' };
        componentFixture.simulateCreate(axisComponent, config);
        componentFixture.simulateRender(opts);

        verifyNumberOfNodes('text', 3);
        verifyNumberOfNodes('line', 0);
      });
    });
  });
});
