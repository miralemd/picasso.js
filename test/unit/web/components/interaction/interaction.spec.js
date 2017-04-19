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

  it('configure simple tap', () => {
    const config = {
      actions: [
        {
          type: 'Tap',
          options: {
            event: 'tap'
          },
          handlers: {
            tap() {
              // event handler for the event specified in options
            }
          }
        },
        {
          type: 'Click',
          handlers: {
            click() {
              // event handler for the click event
            }
          }
        }]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc.listeners('tap').length).to.equal(1);
    expect(interaction.def.mc.listeners('click').length).to.equal(1);
  });

  it('bind native events', () => {
    const config = {
      actions: [
        {
          type: 'Native',
          handlers: {
            mouseover() {
              // event handler for the event with the same name as the function
            }
          }
        }]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.chart.element.listeners.length).to.equal(1);
  });
});
