import dispersion from '../../../../../../src/core/chart-components/markers/generic/dispersion';

describe('Dispersion', () => {
  let composerMock;
  let data;
  let settings;
  let d;

  beforeEach(() => {
    const s = i => i;
    s.step = () => { };

    const datasetMock = {
      map: v => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
        let mapped = {};
        Object.keys(v).forEach((key) => { mapped[key] = item * v[key]; });
        return mapped;
      })
    };

    composerMock = {
      scale: () => s
    };

    settings = {
      settings: {
        x: { scale: 'whatevz' },
        y: { scale: 'whatevz' }
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
    d = dispersion(composerMock);
  });
  it('should fill items with data', () => {
    d = dispersion(composerMock);
    d.updateSettings(settings);
    d.onData(data);
    d.items().forEach((item, i) => {
      expect(item.max).to.equal(i * 2);
      expect(item.min).to.equal(-i * 4);
    });
  });
});
