import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import legendCat from '../../../../../src/core/chart-components/legend-cat/legend-cat';
import catScale from '../../../../../src/core/scales/color/categorical';

describe('Legend Categorical', () => {
  let componentFixture;
  let userDef;
  let container;
  let chartMock;
  let scale;

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
    scale = catScale();
    scale.domain(['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6', 'Item7', 'Item8', 'Item9', 'Item10', 'Item11', 'Item12']);
    scale.range([0, 1]);
    sinon.stub(scale, 'label').returnsArg(0);
    sinon.stub(scale, 'datum').returnsArg(0);
    scale.type = 'categorical';
    chartMock.scale.withArgs('test').returns(scale);
  });

  describe('preferredSize', () => {
    it('should return correct vertical size', () => {
      userDef.dock = 'top';
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(17);
    });

    it('should return correct vertical size and button enabled', () => {
      userDef.dock = 'top';
      userDef.settings.buttons = { show: true };
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(100);
    });

    it('should return correct vertical size based on layout size', () => {
      userDef.dock = 'top';
      userDef.settings.layout = { size: 2, mode: 'table' };
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(32);
    });

    it('should return correct horizontal size', () => {
      userDef.dock = 'left';
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(38);
    });

    it('should return correct horizontal size and buttons enabled', () => {
      userDef.dock = 'left';
      userDef.settings.buttons = { show: true };
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(72);
    });

    it('should return correct horizontal size based on layout size', () => {
      userDef.dock = 'left';
      userDef.settings.layout = { size: 2, mode: 'table' };
      componentFixture.simulateCreate(legendCat, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(38 * 2);
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

  describe('Direction', () => {
    describe('Vertical', () => {
      it('should render items in a single column table layout correctly', () => {
        userDef.settings.direction = 'vertical';
        userDef.dock = 'center';
        userDef.settings.layout = { mode: 'table', size: 1 };
        userDef.settings.title.show = false;
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const rectNodes = componentFixture.findNodes('rect');
        expect(rectNodes).to.be.of.length(4);
        rectNodes.forEach((node, i) => {
          expect(node).to.deep.include({ x: 8, y: 16 * i, width: 8, height: 8 });
        });

        const textNodes = componentFixture.findNodes('text');
        expect(textNodes).to.be.of.length(4);
        textNodes.forEach((node, i) => {
          expect(node).to.deep.include({ x: 24, y: (16 * i) + 6.5 });
        });
      });

      it('should render buttons in a single column table layout correctly', () => {
        userDef.settings.direction = 'vertical';
        userDef.dock = 'center';
        userDef.key = 'key';
        userDef.settings.layout = { mode: 'table', size: 1 };
        userDef.settings.title.show = false;
        userDef.settings.buttons = { show: true };
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const buttons = componentFixture.findNodes('.scroll-button');

        expect(buttons[0]).to.deep.include({ x: 40, y: 76, width: 32, height: 24 });
        expect(buttons[0].children).to.be.of.length(2);
        expect(buttons[1]).to.deep.include({ x: 0, y: 76, width: 32, height: 24 });
        expect(buttons[1].children).to.be.of.length(2);
      });

      it('should render items in a multi column table layout correctly', () => {
        userDef.settings.direction = 'vertical';
        userDef.dock = 'center';
        userDef.settings.layout = { mode: 'table', size: 2 };
        userDef.settings.title.show = false;
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const rectNodes = componentFixture.findNodes('rect');
        expect(rectNodes).to.be.of.length(8);
        rectNodes.slice(0, 4).forEach((node, i) => { // First column
          expect(node).to.deep.include({ x: 8, y: 16 * i, width: 8, height: 8 });
        });

        rectNodes.slice(4).forEach((node, i) => { // Second column
          expect(node).to.deep.include({ x: 46, y: 16 * i, width: 8, height: 8 });
        });

        const textNodes = componentFixture.findNodes('text');
        expect(textNodes).to.be.of.length(8);
        textNodes.slice(0, 4).forEach((node, i) => {
          expect(node).to.deep.include({ x: 24, y: (16 * i) + 6.5 });
        });

        textNodes.slice(4).forEach((node, i) => {
          expect(node).to.deep.include({ x: 62, y: (16 * i) + 6.5 });
        });
      });
    });

    describe('Horizontal', () => {
      it('should render items in a single row table layout correctly', () => {
        userDef.settings.direction = 'horizontal';
        container.inner.width = 200;
        userDef.dock = 'center';
        userDef.settings.layout = { mode: 'table', size: 1 };
        userDef.settings.title.show = false;
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const rectNodes = componentFixture.findNodes('rect');
        expect(rectNodes).to.be.of.length(4);
        rectNodes.forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 8, y: 0, width: 8, height: 8 });
        });

        const textNodes = componentFixture.findNodes('text');
        expect(textNodes).to.be.of.length(4);
        textNodes.forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 24, y: 6.5 });
        });
      });

      it('should render buttons in a single row table layout correctly', () => {
        userDef.settings.direction = 'horizontal';
        container.inner.width = 200;
        userDef.dock = 'center';
        userDef.key = 'key';
        userDef.settings.layout = { mode: 'table', size: 1 };
        userDef.settings.title.show = false;
        userDef.settings.buttons = { show: true };
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const buttons = componentFixture.findNodes('.scroll-button');

        expect(buttons[0]).to.deep.include({ x: 168, y: 24 + 8, width: 32, height: 24 });
        expect(buttons[0].children).to.be.of.length(2);
        expect(buttons[1]).to.deep.include({ x: 168, y: 0, width: 32, height: 24 });
        expect(buttons[1].children).to.be.of.length(2);
      });

      it('should render items in a multi row table layout correctly', () => {
        userDef.settings.direction = 'horizontal';
        container.inner.width = 200;
        userDef.dock = 'center';
        userDef.settings.layout = { mode: 'table', size: 2 };
        userDef.settings.title.show = false;
        componentFixture.simulateCreate(legendCat, userDef);
        componentFixture.simulateRender(container);

        const rectNodes = componentFixture.findNodes('rect');
        expect(rectNodes).to.be.of.length(8);
        rectNodes.slice(0, 4).forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 8, y: 0, width: 8, height: 8 });
        });

        rectNodes.slice(4).forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 8, y: 16, width: 8, height: 8 });
        });

        const textNodes = componentFixture.findNodes('text');
        expect(textNodes).to.be.of.length(8);
        textNodes.slice(0, 4).forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 24, y: 6.5 });
        });

        textNodes.slice(4).forEach((node, i) => {
          expect(node).to.deep.include({ x: (38 * i) + 24, y: 22.5 });
        });
      });
    });
  });
});
