import Dispersion from '../../../../../../src/core/chart-components/markers/generic/dispersion';

describe('Dispersion', () => {
  let composerMock;
  let config;
  let rendererMock;
  let dispersion;

  beforeEach(() => {
    const s = i => i;
    s.scale = { step: () => { } };
    const tableMock = {
      findField: (p = 1) => {
        const values = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => item * p);
        return { values };
      }
    };

    composerMock = {
      scale: () => s,
      table: () => tableMock,
      container: () => { }
    };

    config = {
      settings: {
        x: { source: 1 },
        y: { source: 2 },
        start: { source: 1 },
        end: { source: 1 },
        min: { source: -4 },
        max: { source: 2 },
        med: { source: 1 }
      },
      data: { source: 1 }
    };

    rendererMock = {
      size: () => ({ width: 100, height: 100 }),
      render: sinon.spy(),
      appendTo: () => { }
    };
  });

  it('should instantiate properly', () => {
    dispersion = new Dispersion(config, composerMock, {}, rendererMock);
  });
  it('should fill items with data', () => {
    dispersion = new Dispersion(config, composerMock, {}, rendererMock);
    dispersion.onData();
    dispersion.items.forEach((item, i) => {
      expect(item.max).to.equal(i * 2);
      expect(item.min).to.equal(-i * 4);
    });
  });
});
