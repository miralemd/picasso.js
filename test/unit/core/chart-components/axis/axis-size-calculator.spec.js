import { calcRequiredSize } from '../../../../../src/core/chart-components/axis/axis-size-calculator';

describe('AxisSizeCalculator', () => {
  let settings;
  let ticks;
  let sizeFn;
  let ticksFn;
  let renderer;
  let rect;

  beforeEach(() => {
    settings = {
      dock: 'bottom',
      labels: {
        show: false,
        tilted: false,
        padding: 4,
        layered: false,
        style: {}
      },
      line: {
        show: false,
        style: {
          strokeWidth: 1
        }
      },
      ticks: {
        show: false,
        padding: 0,
        tickSize: 8
      },
      minorTicks: {
        show: false,
        padding: 0,
        tickSize: 3
      }
    };
    ticks = [{ label: 'AA' }, { label: 'BB' }, { label: 'CC' }];
    ticksFn = sinon.stub().returns(ticks);
    rect = { x: 0, y: 0, height: 100, width: 100 };
    let scale = null;
    let data = null;
    let formatter = null;
    renderer = {
      measureText: ({ text }) => ({ width: text.toString().length, height: 5 })
    };
    sizeFn = calcRequiredSize({ settings, ticksFn, scale, data, formatter, renderer });
  });

  it('axis with no visible component have a margin of 10', () => {
    let size = sizeFn(rect);
    expect(size).to.equals(10);
  });

  it('the size of a vertical axis depend on text length', () => {
    settings.dock = 'left';
    settings.labels.show = true;
    let size = sizeFn(rect);
    expect(size).to.equals(16 /* = 10(margin) + 4(label padding) + 2(text size)*/);

    ticks[0].label = 'AAAAAA';
    size = sizeFn(rect);
    expect(size).to.equals(20 /* = 10(margin) + 4(label padding) + 6(text size)*/);
  });

  it("the size of a horizontal axis don't depend on text length", () => {
    settings.dock = 'bottom';
    settings.labels.show = true;
    let size = sizeFn(rect);
    expect(size).to.equals(19);

    ticks[0].label = 'AAAAAA';
    size = sizeFn(rect);
    expect(size).to.equals(19);
  });

  it('layered labels', () => {
    settings.dock = 'bottom';
    settings.labels.show = true;
    settings.labels.layered = true;
    let size = sizeFn(rect);
    expect(size).to.equals(28);
  });

  it('tilted labels', () => {
    settings.dock = 'bottom';
    settings.labels.show = true;
    settings.labels.tilted = true;
    let size = sizeFn(rect);
    expect(size).to.approximately(18.9497, 0.0001);
  });

  it('measure ticks', () => {
    settings.ticks.show = true;
    settings.ticks.padding = 4;
    settings.ticks.tickSize = 7;
    let size = sizeFn(rect);
    expect(size).to.equals(21);
  });

  it('measure minorTicks', () => {
    settings.minorTicks.show = true;
    settings.minorTicks.padding = 2;
    settings.minorTicks.tickSize = 9;
    let size = sizeFn(rect);
    expect(size).to.equals(21);
  });

  it('measure line', () => {
    settings.line.show = true;
    settings.line.style.strokeWidth = 5;
    let size = sizeFn(rect);
    expect(size).to.equals(15);
  });

  it('minor and major ticks', () => {
    settings.ticks.show = true;
    settings.ticks.padding = 4;
    settings.ticks.tickSize = 7;

    settings.minorTicks.show = true;
    settings.minorTicks.padding = 0;
    settings.minorTicks.tickSize = 2;

    let size = sizeFn(rect);
    expect(size).to.equals(21);
  });
});
