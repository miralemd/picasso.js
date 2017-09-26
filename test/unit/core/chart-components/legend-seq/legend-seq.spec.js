import componentFactoryFixture from '../../../../helpers/component-factory-fixture';
import legendSeq from '../../../../../src/core/chart-components/legend-seq/legend-seq';
import sequentialScale from '../../../../../src/core/scales/color/sequential';
import linearScale from '../../../../../src/core/scales/linear';

describe('Legend Sequential', () => {
  let componentFixture;
  let userDef;
  let expectedOutput;
  let expectedTitleNode;
  let expectedTickNodes;
  let expectedGradientNode;
  let container;
  let chartMock;

  beforeEach(() => {
    container = {
      inner: { x: 0, y: 0, width: 100, height: 100 },
      outer: { x: 0, y: 0, width: 100, height: 100 }
    };

    componentFixture = componentFactoryFixture();
    userDef = {
      settings: {
        fill: 'fillScale',
        major: 'majorScale',
        title: {
          text: 'testing'
        }
      }
    };

    chartMock = componentFixture.mocks().chart;

    const seqScale = sequentialScale();
    seqScale.sources = [];
    chartMock.scale.withArgs('fillScale').returns(seqScale);
    const linScale = linearScale();
    linScale.sources = [];
    chartMock.scale.withArgs('majorScale').returns(linScale);

    expectedGradientNode = {
      type: 'rect',
      x: 5,
      y: 15,
      width: 15,
      height: 35,
      fill: {
        type: 'gradient',
        stops: [{
          color: 'rgb(180, 221, 212)',
          offset: 0,
          type: 'stop'
        },
        {
          color: 'rgb(34, 83, 90)',
          offset: 1,
          type: 'stop'
        }],
        degree: 90
      }
    };

    expectedTickNodes = [
      {
        type: 'text',
        x: 25,
        y: 15,
        dx: 0,
        dy: 5,
        text: 0,
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#595959',
        maxWidth: 100,
        anchor: 'start',
        textBoundsFn: componentFixture.mocks().renderer.textBounds
      },
      {
        type: 'text',
        x: 25,
        y: 50,
        dx: 0,
        dy: -1,
        text: 1,
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#595959',
        maxWidth: 100,
        anchor: 'start',
        textBoundsFn: componentFixture.mocks().renderer.textBounds
      },
      {
        type: 'rect',
        width: 0,
        height: 35,
        fill: 'transparent',
        x: 20,
        y: 15
      }
    ];

    expectedTitleNode = {
      type: 'text',
      x: 5,
      y: 10,
      text: 'testing',
      fill: '#595959',
      fontSize: '12px',
      fontFamily: 'Arial',
      maxWidth: 100,
      anchor: 'start'
    };

    expectedOutput = [
      expectedTitleNode,
      {
        type: 'container',
        id: 'legend-seq-target',
        children: [
          expectedGradientNode,
          {
            type: 'container',
            id: 'legend-seq-ticks',
            children: expectedTickNodes
          }
        ]
      }
    ];
  });

  it('defaults', () => {
    componentFixture.simulateCreate(legendSeq, userDef);
    componentFixture.simulateRender(container);
    const output = componentFixture.getRenderOutput();

    expect(output).to.deep.equal(expectedOutput);
    expect(componentFixture.simulateLayout(container)).to.equal(31);
  });

  describe('preferredSize', () => {
    beforeEach(() => {
      componentFixture.mocks().renderer.measureText = () => ({ width: 1000, height: 1000 });
    });

    it('should request to be hidden if tick labels are vertically overlapping', () => {
      userDef.dock = 'left';
      userDef.settings.tick = { anchor: 'left' };
      componentFixture.simulateCreate(legendSeq, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(100); // Return cointainer width
    });

    it('should request to be hidden if tick labels are horizontallay overlapping', () => {
      userDef.dock = 'top';
      userDef.settings.tick = { anchor: 'top' };
      componentFixture.simulateCreate(legendSeq, userDef);
      expect(componentFixture.simulateLayout(container)).to.equal(100); // Return cointainer height
    });
  });

  describe('Vertical layout', () => {
    beforeEach(() => {
      userDef.dock = 'left';
    });

    it('should anchor ticks to the right', () => {
      userDef.settings.tick = { anchor: 'right' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(31);
    });

    it('should anchor ticks to the left', () => {
      userDef.settings.tick = { anchor: 'left' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedTitleNode.anchor = 'end';
      expectedTitleNode.x = 95;

      expectedGradientNode.x = 80;

      expectedTickNodes[0].x = 75;
      expectedTickNodes[0].anchor = 'end';

      expectedTickNodes[1].x = 75;
      expectedTickNodes[1].anchor = 'end';

      expectedTickNodes[2].x = 80;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(31);
    });

    it('should not render title node', () => {
      userDef.settings.title.show = false;
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedOutput.splice(0, 1); // Delete title node

      expectedGradientNode.x = 80;
      expectedGradientNode.y = 5;
      expectedGradientNode.height = 45;

      expectedTickNodes[0].x = 75;
      expectedTickNodes[0].y = 5;
      expectedTickNodes[0].anchor = 'end';

      expectedTickNodes[1].x = 75;
      expectedTickNodes[1].anchor = 'end';

      expectedTickNodes[2].x = 80;
      expectedTickNodes[2].y = 5;
      expectedTickNodes[2].height = 45;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(31);
    });

    it('should support an inverted sequential scale', () => {
      const scaleInstance = sequentialScale({ invert: true });
      scaleInstance.sources = [];
      chartMock.scale.withArgs('fillScale').returns(scaleInstance);
      userDef.settings.tick = { anchor: 'right' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedGradientNode.fill.stops.reverse();
      expectedGradientNode.fill.stops[0].offset = 0;
      expectedGradientNode.fill.stops[1].offset = 1;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(31);
    });
  });

  describe('Horizontal layout', () => {
    beforeEach(() => {
      userDef.dock = 'top';
    });

    it('should anchor ticks on the top', () => {
      userDef.settings.tick = { anchor: 'top' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedTitleNode.anchor = 'end';
      expectedTitleNode.x = 34.5;
      expectedTitleNode.y = 20;

      expectedGradientNode.x = 39.5;
      expectedGradientNode.y = 80;
      expectedGradientNode.width = 33;
      expectedGradientNode.height = 15;
      expectedGradientNode.fill.degree = 180;

      expectedTickNodes[0].x = 39.5;
      expectedTickNodes[0].y = 5;
      expectedTickNodes[0].text = 0;
      expectedTickNodes[0].maxWidth = 16.5;

      expectedTickNodes[1].x = 72.5;
      expectedTickNodes[1].y = 5;
      expectedTickNodes[1].text = 1;
      expectedTickNodes[1].maxWidth = 16.5;
      expectedTickNodes[1].anchor = 'end';
      expectedTickNodes[1].dy = 5;

      expectedTickNodes[2].x = 39.5;
      expectedTickNodes[2].y = 80;
      expectedTickNodes[2].width = 33;
      expectedTickNodes[2].height = 0;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(35);
    });

    it('should anchor ticks on the bottom', () => {
      userDef.settings.tick = { anchor: 'bottom' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedTitleNode.anchor = 'end';
      expectedTitleNode.x = 34.5;
      expectedTitleNode.y = 10;

      expectedGradientNode.x = 39.5;
      expectedGradientNode.y = 5;
      expectedGradientNode.width = 33;
      expectedGradientNode.height = 15;
      expectedGradientNode.fill.degree = 180;

      expectedTickNodes[0].x = 39.5;
      expectedTickNodes[0].y = 25;
      expectedTickNodes[0].text = 0;
      expectedTickNodes[0].maxWidth = 16.5;

      expectedTickNodes[1].x = 72.5;
      expectedTickNodes[1].y = 25;
      expectedTickNodes[1].text = 1;
      expectedTickNodes[1].maxWidth = 16.5;
      expectedTickNodes[1].anchor = 'end';
      expectedTickNodes[1].dy = 5;

      expectedTickNodes[2].x = 39.5;
      expectedTickNodes[2].y = 20;
      expectedTickNodes[2].width = 33;
      expectedTickNodes[2].height = 0;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(35);
    });

    it('should anchor title to the right', () => {
      userDef.settings.title.anchor = 'right';
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedTitleNode.anchor = 'start';
      expectedTitleNode.x = 65.5;
      expectedTitleNode.y = 20;

      expectedGradientNode.x = 27.5;
      expectedGradientNode.y = 80;
      expectedGradientNode.width = 33;
      expectedGradientNode.height = 15;
      expectedGradientNode.fill.degree = 180;

      expectedTickNodes[0].x = 27.5;
      expectedTickNodes[0].y = 5;
      expectedTickNodes[0].text = 0;
      expectedTickNodes[0].maxWidth = 16.5;

      expectedTickNodes[1].x = 60.5;
      expectedTickNodes[1].y = 5;
      expectedTickNodes[1].text = 1;
      expectedTickNodes[1].maxWidth = 16.5;
      expectedTickNodes[1].anchor = 'end';
      expectedTickNodes[1].dy = 5;

      expectedTickNodes[2].x = 27.5;
      expectedTickNodes[2].y = 80;
      expectedTickNodes[2].width = 33;
      expectedTickNodes[2].height = 0;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(35);
    });

    it('should not render title', () => {
      userDef.settings.title.show = false;
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedOutput.splice(0, 1); // Delete title node

      expectedGradientNode.x = 27.5;
      expectedGradientNode.y = 80;
      expectedGradientNode.width = 45;
      expectedGradientNode.height = 15;
      expectedGradientNode.fill.degree = 180;

      expectedTickNodes[0].x = 27.5;
      expectedTickNodes[0].y = 5;
      expectedTickNodes[0].text = 0;
      expectedTickNodes[0].maxWidth = 22.5;

      expectedTickNodes[1].x = 72.5;
      expectedTickNodes[1].y = 5;
      expectedTickNodes[1].text = 1;
      expectedTickNodes[1].maxWidth = 22.5;
      expectedTickNodes[1].anchor = 'end';
      expectedTickNodes[1].dy = 5;

      expectedTickNodes[2].x = 27.5;
      expectedTickNodes[2].y = 80;
      expectedTickNodes[2].width = 45;
      expectedTickNodes[2].height = 0;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(35);
    });

    it('should support an inverted sequential scale', () => {
      const scaleInstance = sequentialScale({ invert: true });
      scaleInstance.sources = [];
      componentFixture.mocks().chart.scale.returns(scaleInstance);
      userDef.settings.tick = { anchor: 'top' };
      componentFixture.simulateCreate(legendSeq, userDef);
      componentFixture.simulateRender(container);
      const output = componentFixture.getRenderOutput();

      expectedTitleNode.anchor = 'end';
      expectedTitleNode.x = 34.5;
      expectedTitleNode.y = 20;

      expectedGradientNode.x = 39.5;
      expectedGradientNode.y = 80;
      expectedGradientNode.width = 33;
      expectedGradientNode.height = 15;
      expectedGradientNode.fill.degree = 180;

      expectedTickNodes[0].x = 39.5;
      expectedTickNodes[0].y = 5;
      expectedTickNodes[0].text = 0;
      expectedTickNodes[0].maxWidth = 16.5;

      expectedTickNodes[1].x = 72.5;
      expectedTickNodes[1].y = 5;
      expectedTickNodes[1].text = 1;
      expectedTickNodes[1].maxWidth = 16.5;
      expectedTickNodes[1].anchor = 'end';
      expectedTickNodes[1].dy = 5;

      expectedTickNodes[2].x = 39.5;
      expectedTickNodes[2].y = 80;
      expectedTickNodes[2].width = 33;
      expectedTickNodes[2].height = 0;

      expect(output).to.deep.equal(expectedOutput);
      expect(componentFixture.simulateLayout(container)).to.equal(35);
    });
  });
});
