import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import hammerMock from '../../../../helpers/hammer-mock';
import interactionComponent from '../../../../../src/web/components/interaction/interaction';

describe('interaction', () => {
  let componentFixture;

  beforeEach(() => {
    componentFixture = componentFactoryFixture();
    componentFixture.mocks();
    hammerMock();
  });

  it('simple tap', () => {
    const config = {
      actions: [{
        type: 'tap',
        handlers: {
          tap() {
            // simple handler
          }
        }
      }]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc).to.be.an('object');
    expect(interaction.def.mc.gestures.length).to.equal(1);
    expect(interaction.def.mc.listeners('tap').length).to.equal(1);
  });

  it('simple native event', () => {
    const config = {
      actions: [{
        type: 'native',
        handlers: {
          mouseover() {
            // simple handler
          }
        }
      }]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc).to.be.an('undefined');
    expect(interaction.def.chart.element.listeners.length).to.equal(1);
  });

  it('disabled interaction', () => {
    const config = {
      enable() { return false; },
      actions: [
        {
          type: 'Click',
          options: {
            enable: true
          },
          handlers: {
            click() {
              // event handle
            }
          }
        },
        {
          type: 'Tap',
          options: {
            enable: true,
            event: 'doubletap',
            taps: 2
          },
          handlers: {
            doubletap() {
              // event handle
            }
          },
          recognizeWith: 'tap'
        },
        {
          type: 'Tap',
          options: {
            enable: true,
            event: 'tap'
          },
          handlers: {
            tap() {
              // event handler for the event specified in options
            }
          },
          requireFailure: 'doubletap'
        },
        {
          type: 'Native',
          enable: true,
          handlers: {
            mouseover() {
            // event handler
            },
            mousedown() {
              // event handler
            }
          }
        }
      ]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc).to.be.an('undefined');
    expect(interaction.def.chart.element.listeners.length).to.equal(0);
  });

  it('mixed hammer gestures and native and updating', () => {
    const config = {
      actions: [
        {
          type: 'Click',
          options: {
            enable: true
          },
          handlers: {
            click() {
              // event handle
            }
          }
        },
        {
          type: 'Tap',
          options: {
            enable: true,
            event: 'doubletap',
            taps: 2
          },
          handlers: {
            doubletap() {
              // event handle
            }
          },
          recognizeWith: 'tap'
        },
        {
          type: 'Tap',
          options: {
            enable: true,
            event: 'tap'
          },
          handlers: {
            tap() {
              // event handler for the event specified in options
            }
          },
          requireFailure: 'doubletap'
        },
        {
          type: 'Native',
          enable: true,
          handlers: {
            mouseover() {
            // event handler
            },
            mousedown() {
              // event handler
            }
          }
        }
      ]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc).to.be.an('object');
    expect(interaction.def.mc.gestures.length).to.equal(3);
    expect(interaction.def.mc.listeners('tap').length).to.equal(1);
    expect(interaction.def.mc.listeners('doubletap').length).to.equal(1);
    expect(interaction.def.mc.listeners('click').length).to.equal(1);
    expect(interaction.def.mc.get('tap').requireFailure.length).to.equal(1);
    expect(interaction.def.mc.get('doubletap').recognizeWith.length).to.equal(1);
    expect(interaction.def.chart.element.listeners.length).to.equal(2);

    const newconfig = {
      actions: [
        {
          type: 'pan',
          options: {
            enable() {
              return true;
            }
          },
          handlers: {
            panstart() {
              // event handle
            },
            pan() {
              // event handle
            },
            panend() {
              // event handle
            }
          }
        },
        {
          type: 'Native',
          options: {
            enable: false
          },
          handlers: {
            mouseover() {
            // event handler
            },
            mousedown() {
              // event handler
            }
          }
        }
      ]
    };
    componentFixture.simulateUpdate(newconfig);
    expect(interaction.def.mc.gestures.length).to.equal(1);
    expect(interaction.def.mc.listeners('click').length).to.equal(0);
    expect(interaction.def.mc.listeners('panstart').length).to.equal(1);
    expect(interaction.def.mc.listeners('pan').length).to.equal(1);
    expect(interaction.def.mc.listeners('panend').length).to.equal(1);
    expect(interaction.def.chart.element.listeners.length).to.equal(0);
  });
});
