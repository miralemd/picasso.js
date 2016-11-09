import { abstractAxis } from '../../../../../src/core/chart-components/axis/axis';
import { linear } from '../../../../../src/core/scales/linear';
import { band } from '../../../../../src/core/scales/band';
import { formatter } from '../../../../../src/core/formatter';

describe('Axis', () => {
  let composerMock;
  let config;
  let rendererMock;
  let axis;
  let formatterSpy;

  function verifyNumberOfNodes(tNodes, lNodes) {
    const nodes = rendererMock.render.args[0][0];
    const textNodes = nodes.filter(n => n.type === 'text');
    const lineNodes = nodes.filter(n => n.type === 'line');
    expect(textNodes.length, 'Unexpected number of text nodes').to.equal(tNodes);
    expect(lineNodes.length, 'Unexpected number of line nodes').to.equal(lNodes);
  }

  beforeEach(() => {
    const s = {};
    const formatterBuilder = () => formatter('d3')('number')(' ');
    formatterSpy = sinon.spy(formatterBuilder);
    composerMock = {
      scale: () => s,
      formatter: formatterSpy
    };

    config = {
      scale: 'y',
      settings: {}
    };

    rendererMock = {
      size: () => ({ width: 100, height: 100 }),
      render: sinon.spy(),
      measureText: ({ text }) => ({ width: text.toString().length, height: 5 })
    };
  });

  describe('continuous', () => {
    beforeEach(() => {
      composerMock.scale().scale = linear();
      composerMock.scale().type = 'linear';
      composerMock.scale().sources = ['fieldSource'];

      axis = abstractAxis(config, composerMock, rendererMock);
    });

    it('should instantiate a default formatter dervied from the first field', () => {
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'fieldSource' });
    });

    it('should instantiate a formatter referenced by name', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = 'customFormatter';
      axis = abstractAxis(config, composerMock, rendererMock);
      expect(formatterSpy.args[0][0]).to.equal('customFormatter');
    });

    it('should instantiate a formatter derived from a configured field', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = { source: 'customSource' };
      axis = abstractAxis(config, composerMock, rendererMock);
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'customSource' });
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        axis().render();
        verifyNumberOfNodes(3, 4);
      });
    });

    it('should not render labels when disabled', () => {
      config.settings.labels = { show: false };
      axis().render();
      verifyNumberOfNodes(0, 4);
    });

    it('should not render axis line when disabled', () => {
      config.settings.line = { show: false };
      axis().render();
      verifyNumberOfNodes(3, 3);
    });

    it('should not render ticks when disabled', () => {
      config.settings.ticks = { show: false };
      axis().render();
      verifyNumberOfNodes(3, 1);
    });

    it('should render a custom number of ticks', () => {
      config.settings.ticks = { count: 5 };
      axis().render();
      verifyNumberOfNodes(6, 7);
    });

    it('should render minor ticks', () => {
      config.settings.minorTicks = { show: true, count: 2 };
      axis().render();
      verifyNumberOfNodes(2, 7);
    });

    it('should extend domain of scale with custom min/max values', () => {
      config.settings.ticks = { min: -10, max: 10 };
      axis().render();
      const actualMin = composerMock.scale().scale.start();
      const actualMax = composerMock.scale().scale.end();
      expect(actualMin).to.equal(-10);
      expect(actualMax).to.equal(10);
    });

    it('should not extend domain based on tight ticks generation if custom min/max values are set', () => {
      config.settings.ticks = { min: -10, max: 400 };
      config.settings.ticks.tight = true;
      axis().render();
      const actualMin = composerMock.scale().scale.start();
      const actualMax = composerMock.scale().scale.end();
      expect(actualMin).to.equal(-10);
      expect(actualMax).to.equal(400);
    });
  });

  describe('discrete', () => {
    let data;
    let dataMapperMock;

    beforeEach(() => {
      data = ['d1', 'd2', 'd3'];
      composerMock.data = data;
      composerMock.scale().scale = band([0, 1, 2], [0, 1]);
      composerMock.scale().type = 'ordinal';
      composerMock.scale().sources = ['source'];

      dataMapperMock = () => data;
      axis = abstractAxis(config, composerMock, rendererMock);
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        axis(dataMapperMock).render();
        verifyNumberOfNodes(3, 4);
      });
    });

    ['top', 'bottom'].forEach((d) => {
      it(`should support layered labels for ${d} aligned axis`, () => {
        config.settings.align = d;
        config.settings.labels = { layered: true };
        axis(dataMapperMock).render();
        verifyNumberOfNodes(3, 4);
      });
    });
  });
});
