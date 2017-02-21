// import { scaleLinear as linear, scaleBand as band } from 'd3-scale';
import axisComponent from '../../../../../src/core/chart-components/axis/axis';
import linear from '../../../../../src/core/scales/linear';
import ordinal from '../../../../../src/core/scales/ordinal';
import { formatter } from '../../../../../src/core/formatter';

describe('Axis', () => {
  let composerMock;
  let config;
  let renderSpy;
  let scale = {};

  function verifyNumberOfNodes(tNodes, lNodes) {
    const nodes = renderSpy.args[0][0];
    const textNodes = nodes.filter(n => n.type === 'text');
    const lineNodes = nodes.filter(n => n.type === 'line');
    expect(textNodes.length, 'Unexpected number of text nodes').to.equal(tNodes);
    expect(lineNodes.length, 'Unexpected number of line nodes').to.equal(lNodes);
  }

  function createAndRenderAxis(opts) {
    const {
      inner,
      outer
    } = opts;
    const component = axisComponent(config, composerMock);
    component.beforeMount();
    component.resize(inner, outer);
    component.beforeRender();
    component.render();
    component.mounted();
    return component;
  }

  beforeEach(() => {
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
      scale: () => scale,
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
      scale = linear();
      /* composerMock.scale.type = 'linear';
      composerMock.scale.sources = ['fieldSource'];*/
    });

    /*
    it('should instantiate a default formatter derived from the first field', () => {
      createAndRenderAxis();
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'fieldSource' });
    });

    it('should instantiate a formatter referenced by name', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = 'customFormatter';
      createAndRenderAxis();
      expect(formatterSpy.args[0][0]).to.equal('customFormatter');
    });

    it('should instantiate a formatter derived from a configured field', () => {
      formatterSpy.reset(); // Reset spy here because init is done in beforeEach
      config.formatter = { source: 'customSource' };
      createAndRenderAxis();
      expect(formatterSpy.args[0][0]).to.deep.equal({ source: 'customSource' });
    });
    */

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        createAndRenderAxis({
          inner: { x: 0, y: 0, width: 100, height: 100 },
          outer: { x: 0, y: 0, width: 100, height: 100 }
        });
        verifyNumberOfNodes(3, 4);
      });
    });

    it('should not render labels when disabled', () => {
      config.settings.labels = { show: false };
      createAndRenderAxis({
        inner: { x: 0, y: 0, width: 100, height: 100 },
        outer: { x: 0, y: 0, width: 100, height: 100 }
      });
      verifyNumberOfNodes(0, 4);
    });

    it('should not render axis line when disabled', () => {
      config.settings.line = { show: false };
      createAndRenderAxis({
        inner: { x: 0, y: 0, width: 100, height: 100 },
        outer: { x: 0, y: 0, width: 100, height: 100 }
      });
      verifyNumberOfNodes(3, 3);
    });

    it('should not render ticks when disabled', () => {
      config.settings.ticks = { show: false };
      createAndRenderAxis({
        inner: { x: 0, y: 0, width: 100, height: 100 },
        outer: { x: 0, y: 0, width: 100, height: 100 }
      });
      verifyNumberOfNodes(3, 1);
    });
  });

  describe('discrete', () => {
    let data;

    beforeEach(() => {
      data = ['d1', 'd2', 'd3'];
      composerMock.data = data;
      scale = ordinal();
      scale.domain([0, 1, 2]);
      scale.range([0, 1]);
      composerMock.scale().type = 'ordinal';
      /* composerMock.scale().sources = ['source'];*/
    });

    ['left', 'right', 'top', 'bottom'].forEach((d) => {
      it(`should align to ${d}`, () => {
        config.settings.align = d;
        createAndRenderAxis({
          inner: { x: 0, y: 0, width: 100, height: 100 },
          outer: { x: 0, y: 0, width: 100, height: 100 }
        });
        verifyNumberOfNodes(3, 0);
      });
    });

    ['top', 'bottom'].forEach((d) => {
      it(`should support layered labels for ${d} aligned axis`, () => {
        config.settings.align = d;
        config.settings.labels = { layered: true };
        createAndRenderAxis({
          inner: { x: 0, y: 0, width: 100, height: 100 },
          outer: { x: 0, y: 0, width: 100, height: 100 }
        });
        verifyNumberOfNodes(3, 0);
      });
    });
  });
});
