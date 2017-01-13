import calcRequiredSize from '../../../../../src/core/chart-components/axis/axis-size-calculator';
import { continuousDefaultSettings } from '../../../../../src/core/chart-components/axis/axis-default-settings';

describe('AxisSizeCalculator', () => {
  let settings;
  let ticks;
  let sizeFn;
  let ticksFn;
  let rect;

  beforeEach(() => {
    settings = continuousDefaultSettings();
    settings.labels.show = false;
    settings.line.show = false;
    settings.ticks.show = false;
    settings.paddingStart = 0;
    settings.paddingEnd = 10;

    ticks = [{ label: 'AA' }, { label: 'BB' }, { label: 'CC' }];
    ticksFn = sinon.stub().returns(ticks);
    rect = { x: 0, y: 0, height: 100, width: 100 };
    const scale = null;
    const data = null;
    const formatter = null;
    const setEdgeBleed = () => {};
    const measureText = ({ text = '' }) => ({ width: text.toString().length, height: 5 });
    sizeFn = r => calcRequiredSize({ settings, rect: r, ticksFn, scale, data, formatter, measureText, setEdgeBleed });
  });

  it('axis with no visible component have a margin of 10', () => {
    const size = sizeFn(rect);
    expect(size).to.equals(10);
  });

  it('the size of a vertical axis depend on text length', () => {
    settings.dock = 'left';
    settings.align = 'left';
    settings.labels.show = true;
    let size = sizeFn(rect);
    expect(size).to.equals(16 /* = 10(margin) + 4(label padding) + 2(text size)*/);

    ticks[0].label = 'AAAAAA';
    size = sizeFn(rect);
    expect(size).to.equals(20 /* = 10(margin) + 4(label padding) + 6(text size)*/);
  });

  it("the size of a horizontal axis don't depend on text length", () => {
    settings.dock = 'bottom';
    settings.align = 'bottom';
    settings.labels.show = true;
    let size = sizeFn(rect);
    expect(size).to.equals(19);

    ticks[0].label = 'AAAAAA';
    size = sizeFn(rect);
    expect(size).to.equals(19);
  });

  it('layered labels', () => {
    settings.dock = 'bottom';
    settings.align = 'bottom';
    settings.labels.show = true;
    settings.labels.layered = true;
    const size = sizeFn(rect);
    expect(size).to.equals(28);
  });

  it('tilted labels', () => {
    settings.dock = 'bottom';
    settings.align = 'bottom';
    settings.labels.show = true;
    settings.labels.tilted = true;
    const size = sizeFn(rect);
    expect(size).to.approximately(19.1158, 0.0001);
  });

  it('tilted labels with max width', () => {
    settings.dock = 'bottom';
    settings.align = 'bottom';
    settings.labels.show = true;
    settings.labels.tilted = true;
    settings.labels.maxWidth = 5;
    ticks[0].label = 'AAAAAAAAAAAAAA';
    const size = sizeFn(rect);
    expect(size).to.approximately(21.0442, 0.0001);
  });

  it('measure ticks', () => {
    settings.ticks.show = true;
    settings.ticks.margin = 4;
    settings.ticks.tickSize = 7;
    const size = sizeFn(rect);
    expect(size).to.equals(21);
  });

  it('measure minorTicks', () => {
    settings.minorTicks.show = true;
    settings.minorTicks.margin = 2;
    settings.minorTicks.tickSize = 9;
    const size = sizeFn(rect);
    expect(size).to.equals(21);
  });

  it('measure line', () => {
    settings.line.show = true;
    settings.line.strokeWidth = 5;
    const size = sizeFn(rect);
    expect(size).to.equals(15);
  });

  it('minor and major ticks', () => {
    settings.ticks.show = true;
    settings.ticks.margin = 4;
    settings.ticks.tickSize = 7;

    settings.minorTicks.show = true;
    settings.minorTicks.margin = 0;
    settings.minorTicks.tickSize = 2;

    const size = sizeFn(rect);
    expect(size).to.equals(21);
  });
});
