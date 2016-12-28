import Dispersion from '../../../../../../src/core/chart-components/markers/generic/dispersion';

describe('Dispersion', () => {
  let composerMock;
  let config;
  let rendererMock;
  let dispersion;

  beforeEach(() => {
    const s = i => i;
    s.scale = { step: () => { } };

    const datasetMock = {
      map: v => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
        let mapped = {};
        Object.keys(v).forEach((key) => { mapped[key] = item * v[key]; });
        return mapped;
      })
    };

    composerMock = {
      scale: () => s,
      dataset: () => datasetMock,
      container: () => { }
    };

    config = {
      settings: {
        x: { scale: 'whatevz' },
        y: { scale: 'whatevz' }
      },
      data: { mapTo: {
        start: 1,
        end: 1,
        min: -4,
        max: 2,
        med: 1
      } }
    };

    rendererMock = {
      size: () => ({ width: 100, height: 100 }),
      render: sinon.spy(),
      appendTo: () => { }
    };
  });

  it('should instantiate properly', () => {
    dispersion = new Dispersion(composerMock, {}, rendererMock);
  });
  it('should fill items with data', () => {
    dispersion = new Dispersion(composerMock, {}, rendererMock);
    dispersion.setOpts(config);
    dispersion.onData();
    dispersion.items.forEach((item, i) => {
      expect(item.max).to.equal(i * 2);
      expect(item.min).to.equal(-i * 4);
    });
  });
});
