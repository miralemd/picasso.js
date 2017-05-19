import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import textComponent from '../../../../../src/core/chart-components/text/text';
import band from '../../../../../src/core/scales/band';

function assertNodeProperties(node, expected) {
  Object.keys(expected).forEach((key) => {
    expect(node).to.have.property(key, expected[key]);
  });
}

describe('Text component', () => {
  let config;
  let scale = band();
  let componentFixture;
  let opts;
  let chart;

  function simulateRender() {
    componentFixture.simulateCreate(textComponent, config);
    const nodes = componentFixture.simulateRender(opts);
    return nodes[0];
  }

  function simulateUpdate() {
    const nodes = componentFixture.simulateUpdate(config);
    return nodes[0];
  }

  function simulateLayout() {
    componentFixture.simulateCreate(textComponent, config);
    return componentFixture.simulateLayout(opts);
  }

  beforeEach(() => {
    componentFixture = componentFactoryFixture();

    chart = componentFixture.mocks().chart;
    chart.scale.returns(scale);
    const table = {
      findField: () => ({
        title: () => 'fakeTitle'
      })
    };
    chart.dataset.returns({ tables: () => [table] });

    config = {
      text: 'Testing',
      settings: {}
    };

    opts = {
      inner: { x: 0, y: 0, width: 100, height: 100 },
      outer: { x: 0, y: 0, width: 100, height: 100 }
    };
  });

  describe('Dock', () => {
    describe('Left', () => {
      beforeEach(() => {
        config.dock = 'left';
      });

      describe('Anchor', () => {
        it('default', () => {
          const node = simulateRender();

          const expected = {
            x: 95,
            y: 50,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(270, 93.33333333333333, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('center', () => {
          config.settings.anchor = 'center';
          const node = simulateRender();

          const expected = {
            x: 95,
            y: 50,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(270, 93.33333333333333, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('top', () => {
          config.settings.anchor = 'top';
          const node = simulateRender();

          const expected = {
            x: 95,
            y: 5,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'end',
            transform: 'rotate(270, 93.33333333333333, 5)'
          };

          assertNodeProperties(node, expected);
        });

        it('bottom', () => {
          config.settings.anchor = 'bottom';
          const node = simulateRender();

          const expected = {
            x: 95,
            y: 95,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'start',
            transform: 'rotate(270, 93.33333333333333, 95)'
          };

          assertNodeProperties(node, expected);
        });
      });

      describe('Padding', () => {
        it('start', () => {
          config.settings.paddingStart = 10;
          const node = simulateRender();

          const expected = {
            x: 90,
            y: 50,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(270, 88.33333333333333, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('end', () => {
          config.settings.paddingEnd = 10;
          const node = simulateRender();

          const expected = {
            x: 95,
            y: 50,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(270, 93.33333333333333, 50)'
          };

          assertNodeProperties(node, expected);
        });
      });
    });

    describe('Right', () => {
      beforeEach(() => {
        config.dock = 'right';
      });

      describe('Anchor', () => {
        it('default', () => {
          const node = simulateRender();

          const expected = {
            x: 5,
            y: 50,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(90, 6.666666666666667, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('center', () => {
          config.settings.anchor = 'center';
          const node = simulateRender();

          const expected = {
            x: 5,
            y: 50,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(90, 6.666666666666667, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('top', () => {
          config.settings.anchor = 'top';
          const node = simulateRender();

          const expected = {
            x: 5,
            y: 5,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'start',
            transform: 'rotate(90, 6.666666666666667, 5)'
          };

          assertNodeProperties(node, expected);
        });

        it('bottom', () => {
          config.settings.anchor = 'bottom';
          const node = simulateRender();

          const expected = {
            x: 5,
            y: 95,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'end',
            transform: 'rotate(90, 6.666666666666667, 95)'
          };

          assertNodeProperties(node, expected);
        });
      });

      describe('Padding', () => {
        it('start', () => {
          config.settings.paddingStart = 10;
          const node = simulateRender();

          const expected = {
            x: 10,
            y: 50,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(90, 11.666666666666666, 50)'
          };

          assertNodeProperties(node, expected);
        });

        it('end', () => {
          config.settings.paddingEnd = 10;
          const node = simulateRender();

          const expected = {
            x: 5,
            y: 50,
            dx: 1.6666666666666667,
            dy: 0,
            anchor: 'middle',
            transform: 'rotate(90, 6.666666666666667, 50)'
          };

          assertNodeProperties(node, expected);
        });
      });
    });

    describe('Top', () => {
      beforeEach(() => {
        config.dock = 'top';
      });

      describe('Anchor', () => {
        it('default', () => {
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('center', () => {
          config.settings.anchor = 'center';
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('left', () => {
          config.settings.anchor = 'left';
          const node = simulateRender();

          const expected = {
            x: 0,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'start'
          };

          assertNodeProperties(node, expected);
        });

        it('right', () => {
          config.settings.anchor = 'right';
          const node = simulateRender();

          const expected = {
            x: 100,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'end'
          };

          assertNodeProperties(node, expected);
        });
      });

      describe('Padding', () => {
        it('start', () => {
          config.settings.paddingStart = 10;
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 90,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('end', () => {
          config.settings.paddingEnd = 10;
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('left', () => {
          config.settings.paddingLeft = 10;
          config.settings.anchor = 'left';
          const node = simulateRender();

          const expected = {
            x: 10,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'start'
          };

          assertNodeProperties(node, expected);
        });

        it('right', () => {
          config.settings.paddingRight = 10;
          config.settings.anchor = 'right';
          const node = simulateRender();

          const expected = {
            x: 90,
            y: 95,
            dx: 0,
            dy: -0.8333333333333334,
            anchor: 'end'
          };

          assertNodeProperties(node, expected);
        });
      });
    });

    describe('Bottom', () => {
      beforeEach(() => {
        config.dock = 'bottom';
      });

      describe('Anchor', () => {
        it('default', () => {
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('center', () => {
          config.settings.anchor = 'center';
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('left', () => {
          config.settings.anchor = 'left';
          const node = simulateRender();

          const expected = {
            x: 0,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'start'
          };

          assertNodeProperties(node, expected);
        });

        it('right', () => {
          config.settings.anchor = 'right';
          const node = simulateRender();

          const expected = {
            x: 100,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'end'
          };

          assertNodeProperties(node, expected);
        });
      });

      describe('Padding', () => {
        it('start', () => {
          config.settings.paddingStart = 10;
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 15,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('end', () => {
          config.settings.paddingEnd = 10;
          const node = simulateRender();

          const expected = {
            x: 50,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'middle'
          };

          assertNodeProperties(node, expected);
        });

        it('left', () => {
          config.settings.paddingLeft = 10;
          config.settings.anchor = 'left';
          const node = simulateRender();

          const expected = {
            x: 10,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'start'
          };

          assertNodeProperties(node, expected);
        });

        it('right', () => {
          config.settings.paddingRight = 10;
          config.settings.anchor = 'right';
          const node = simulateRender();

          const expected = {
            x: 90,
            y: 10,
            dx: 0,
            dy: -1.6666666666666667,
            anchor: 'end'
          };

          assertNodeProperties(node, expected);
        });
      });
    });
  });

  describe('Settings', () => {
    it('maxLengthPx', () => {
      config.dock = 'left';
      config.settings.maxLengthPx = 33;
      const node = simulateRender();

      const expected = {
        maxWidth: config.settings.maxLengthPx
      };

      assertNodeProperties(node, expected);
    });

    it('maxLengthPx should default to 80% of height', () => {
      config.dock = 'left';
      const node = simulateRender();

      const expected = {
        maxWidth: opts.inner.height * 0.8
      };

      assertNodeProperties(node, expected);
    });

    it('maxLengthPx should default to 80% of width', () => {
      config.dock = 'bottom';
      const node = simulateRender();

      const expected = {
        maxWidth: opts.inner.width * 0.8
      };

      assertNodeProperties(node, expected);
    });

    it('join character', () => {
      scale.sources = ['/0/0', '/1/0'];
      config.dock = 'left';
      config.scale = 'x';
      config.text = undefined;
      config.settings.join = '#';
      const node = simulateRender();
      expect(node.text).to.equal('fakeTitle#fakeTitle');
    });

    it('join as empty string', () => {
      scale.sources = ['/0/0', '/1/0'];
      config.dock = 'left';
      config.scale = 'x';
      config.text = undefined;
      config.settings.join = '';
      const node = simulateRender();
      expect(node.text).to.equal('fakeTitlefakeTitle');
    });
  });

  describe('Lifecycle', () => {
    describe('Update', () => {
      beforeEach(() => {
        config.dock = 'left';
        simulateRender();
      });

      it('should update dock', () => {
        config.dock = 'bottom';
        const node = simulateUpdate();

        const expected = {
          x: 50,
          y: 10,
          dx: 0,
          dy: -1.6666666666666667,
          anchor: 'middle'
        };

        assertNodeProperties(node, expected);
      });

      it('should update source', () => {
        config.text = 'UpdatedText';
        const node = simulateUpdate();

        const expected = {
          text: config.text
        };

        assertNodeProperties(node, expected);
      });

      describe('should update settings', () => {
        it('maxLengthPx', () => {
          config.settings.maxLengthPx = 33;
          const node = simulateUpdate();

          const expected = {
            maxWidth: config.settings.maxLengthPx
          };

          assertNodeProperties(node, expected);
        });

        it('style', () => {
          config.settings.style = {
            fontSize: 'thick and slim',
            fontFamily: 'nice family',
            fill: 'good color'
          };
          const node = simulateUpdate();

          const expected = {
            fontSize: 'thick and slim',
            fontFamily: 'nice family',
            fill: 'good color'
          };

          assertNodeProperties(node, expected);
        });

        it('anchor', () => {
          config.settings.anchor = 'top';
          const node = simulateUpdate();

          const expected = {
            x: 95,
            y: 5,
            dx: -1.6666666666666667,
            dy: 0,
            anchor: 'end',
            transform: 'rotate(270, 93.33333333333333, 5)'
          };

          assertNodeProperties(node, expected);
        });
      });
    });
  });

  describe('preferredSize', () => {
    it('should return same size for all dock areas', () => {
      ['left', 'right', 'top', 'bottom'].forEach((dock) => {
        config.dock = dock;
        const size = simulateLayout();
        expect(size).to.equal(15);
      });
    });

    it('should be affected by padding start', () => {
      config.dock = 'left';
      config.settings.paddingStart = 33;
      const size = simulateLayout();
      expect(size).to.equal(43);
    });

    it('should be affected by padding end', () => {
      config.dock = 'left';
      config.settings.paddingStart = 33;
      const size = simulateLayout();
      expect(size).to.equal(43);
    });
  });

  describe('Source', () => {
    it('string', () => {
      config.dock = 'left';
      config.text = 'myString';
      const node = simulateRender();
      expect(node.text).to.equal(config.text);
    });

    it('function', () => {
      config.dock = 'left';
      config.text = () => 'myFunc';
      const node = simulateRender();
      expect(node.text).to.equal('myFunc');
    });

    it('scale by reference', () => {
      scale.sources = '/0/0';
      config.dock = 'left';
      config.scale = 'x';
      config.text = undefined;
      const node = simulateRender();
      expect(node.text).to.equal('fakeTitle');
    });

    it('scale by reference with multiple sources', () => {
      scale.sources = ['/0/0', '/1/0'];
      config.dock = 'left';
      config.scale = 'x';
      config.text = undefined;
      const node = simulateRender();
      expect(node.text).to.equal('fakeTitle, fakeTitle');
    });
  });
});
