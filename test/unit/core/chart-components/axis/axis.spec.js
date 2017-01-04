import axisComponent from '../../../../../src/core/chart-components/axis/axis';
import { linear } from '../../../../../src/core/scales/linear';
import { band } from '../../../../../src/core/scales/band';
import { formatter } from '../../../../../src/core/formatter';

describe('Axis', () => {
  let composerMock;
  let config;
  let renderSpy;
  let axis;

  function verifyNumberOfNodes(tNodes, lNodes) {
    const nodes = renderSpy.args[0][0];
    const textNodes = nodes.filter(n => n.type === 'text');
    const lineNodes = nodes.filter(n => n.type === 'line');
    expect(textNodes.length, 'Unexpected number of text nodes').to.equal(tNodes);
    expect(lineNodes.length, 'Unexpected number of line nodes').to.equal(lNodes);
  }

  beforeEach(() => {
    const s = {};
    const f = formatter('d3')('number')(' ');
    renderSpy = sinon.spy();
    composerMock = {
      renderer: {
        size: () => ({ width: 100, height: 100 }),
        render: renderSpy,
        appendTo: () => {},
        measureText: ({ text }) => ({
          width: text.toString().length,
          height: 5
        })
      },
      brush: () => ({
        on: () => {}
      }),
      scale: () => s,
      dataset: () => {},
      container: () => {},
      formatter: () => f
    };

    config = {
      scale: 'y',
      formatter: 'f',
      settings: {}
    };
  });

  describe('continuous', () => {
    beforeEach(() => {
      composerMock.scale().scale = linear();
      composerMock.scale().type = 'linear';
      composerMock.scale().sources = ['fieldSource'];
    });

    /*
    it('should instantiate a default formatter derived from the first field', () => {
      axis = axisComponent(config, composerMock);
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'fieldSource' });
    });

    it('should instantiate a formatter referenced by name', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = 'customFormatter';
      axis = axisComponent(config, composerMock);
      expect(formatterSpy.args[0][0]).to.equal('customFormatter');
    });

    it('should instantiate a formatter derived from a configured field', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = { source: 'customSource' };
      axis = axisComponent(config, composerMock);
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'customSource' });
    });
    */

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        axis = axisComponent(config, composerMock);
        axis.render();
        verifyNumberOfNodes(3, 4);
      });
    });

    it('should not render labels when disabled', () => {
      config.settings.labels = { show: false };
      axis = axisComponent(config, composerMock);
      axis.render();
      verifyNumberOfNodes(0, 4);
    });

    it('should not render axis line when disabled', () => {
      config.settings.line = { show: false };
      axis = axisComponent(config, composerMock);
      axis.render();
      verifyNumberOfNodes(3, 3);
    });

    it('should not render ticks when disabled', () => {
      config.settings.ticks = { show: false };
      axis = axisComponent(config, composerMock);
      axis.render();
      verifyNumberOfNodes(3, 1);
    });

    it('should render a custom number of ticks', () => {
      config.settings.ticks = { count: 5 };
      axis = axisComponent(config, composerMock);
      axis.render();
      verifyNumberOfNodes(6, 7);
    });

    it('should render minor ticks', () => {
      config.settings.minorTicks = { show: true, count: 2 };
      axis = axisComponent(config, composerMock);
      axis.render();
      verifyNumberOfNodes(3, 8);
    });
  });

  describe('discrete', () => {
    let data;

    beforeEach(() => {
      data = ['d1', 'd2', 'd3'];
      composerMock.data = data;
      composerMock.scale().scale = band([0, 1, 2], [0, 1]);
      composerMock.scale().type = 'ordinal';
      composerMock.scale().sources = ['source'];
      axis = axisComponent(config, composerMock);
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        axis.render();
        verifyNumberOfNodes(3, 4);
      });
    });

    ['top', 'bottom'].forEach((d) => {
      it(`should support layered labels for ${d} aligned axis`, () => {
        config.settings.align = d;
        config.settings.labels = { layered: true };
        axis.render();
        verifyNumberOfNodes(3, 4);
      });
    });
  });
});
