import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import hammerMock from '../../../../helpers/hammer-mock';
import interactionComponent from '../../../../../src/core/chart-components/interaction/interaction';

describe('interaction', () => {
  let componentFixture;

  beforeEach(() => {
    componentFixture = componentFactoryFixture();
    componentFixture.mocks();
    hammerMock();
  });

  it('simple tap', () => {
    const config = {
      actions: [
        {
          // triple tap
          type: 'Tap',
          options: {
            event: 'tap'
          },
          handlers: {
            tap: function tap() {
              // event handler for the event specified in options
            }
          }
        }]
    };
    let interaction = componentFixture.simulateCreate(interactionComponent, config);
    componentFixture.simulateRender({});
    expect(interaction.def.mc.listeners('tap').length).to.equal(1);
  });
});
