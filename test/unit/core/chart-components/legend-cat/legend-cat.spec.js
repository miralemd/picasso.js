import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import legendCat from '../../../../../src/core/chart-components/legend-cat/legend-cat';
import catScale from '../../../../../src/core/scales/color/categorical';

describe('Legend Categorical', () => {
  let componentFixture;
  let userDef;
  let container;
  let chartMock;

  beforeEach(() => {
    container = {
      inner: { x: 0, y: 0, width: 100, height: 100 },
      outer: { x: 0, y: 0, width: 100, height: 100 }
    };

    componentFixture = componentFactoryFixture();
    userDef = {
      scale: 'test',
      settings: {
        title: {
          show: true,
          text: 'testing'
        }
      }
    };

    chartMock = componentFixture.mocks().chart;
    const s = catScale();
    s.type = 'categorical';
    chartMock.scale.withArgs('test').returns(s);
  });

  describe('preferredSize', () => {
    it('should return correct vertical size', () => {
      userDef.dock = 'top';
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(17);
    });

    it('should return correct horizontal size', () => {
      userDef.dock = 'left';
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(19);
    });

    describe('should request to be hidden', () => {
      beforeEach(() => {
        componentFixture.mocks().renderer.measureText = () => ({ width: 1000, height: 1000 });
        componentFixture.mocks().renderer.textBounds = () => ({ x: 0, y: 0, width: 1000, height: 1000 });
      });

      it('if item labels require to much horizontal space', () => {
        userDef.dock = 'left';
        componentFixture.simulateCreate(legendCat, userDef);
        expect(componentFixture.simulateLayout(container)).to.equal(100); // Return cointainer width
      });

      it('if item labels require to much vertical space', () => {
        userDef.dock = 'top';
        componentFixture.simulateCreate(legendCat, userDef);
        expect(componentFixture.simulateLayout(container)).to.equal(100); // Return cointainer height
      });
    });
  });
});
