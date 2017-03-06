import dispersion from '../../../../../../src/core/chart-components/markers/generic/dispersion';

describe('Dispersion', () => {
  let chartMock;
  let data;
  let settings;
  let d;

  beforeEach(() => {
    const s = i => i;
    s.bandWidth = () => { };

    const datasetMock = {
      map: v => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
        let mapped = {};
        Object.keys(v).forEach((key) => { mapped[key] = item * v[key]; });
        return mapped;
      })
    };

    chartMock = {
      scale: () => s
    };

    settings = {
      settings: {
        major: { scale: 'whatevz' },
        minor: { scale: 'whatevz' }
      }
    };

    data = datasetMock.map({
      start: 1,
      end: 1,
      min: -4,
      max: 2,
      med: 1
    });
  });

  it('should instantiate properly', () => {
    d = dispersion(chartMock)();
  });
  it('should fill items with data', () => {
    d = dispersion(chartMock)();
    d.updateSettings(settings);
    d.onData(data);
    d.items().forEach((item, i) => {
      expect(item.max).to.equal(i * 2);
      expect(item.min).to.equal(-i * 4);
    });
  });
});
