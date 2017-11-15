import {
  labelItem,
  resolveMargin
} from '../../../../../src/core/chart-components/legend-cat/label-item';

describe('resolveMargin', () => {
  it('should handle invalid formats', () => {
    let defaultResult = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    };

    expect(resolveMargin()).to.be.eql(defaultResult);
    expect(resolveMargin(null)).to.be.eql(defaultResult);
    expect(resolveMargin(0)).to.be.eql(defaultResult);
    expect(resolveMargin({})).to.be.eql(defaultResult);
  });

  it('should handle single number', () => {
    let expectedResult = {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
      width: 10,
      height: 10
    };

    expect(resolveMargin(5)).to.be.eql(expectedResult);
  });

  it('should handle strings part 1', () => {
    let expectedResult = {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
      width: 10,
      height: 10
    };

    expect(resolveMargin('5')).to.be.eql(expectedResult);
    expect(resolveMargin('5px')).to.be.eql(expectedResult);
    expect(resolveMargin('5px 5px')).to.be.eql(expectedResult);
    expect(resolveMargin('5px 5px 5px')).to.be.eql(expectedResult);
    expect(resolveMargin('5px 5px 5px 5px')).to.be.eql(expectedResult);
  });

  it('should handle strings part 2', () => {
    let expectedResult = {
      top: 9,
      right: 8,
      bottom: 6,
      left: 5,
      width: 13,
      height: 15
    };

    expect(resolveMargin('9px 8px 6px 5px')).to.be.eql(expectedResult);
  });

  it('should handle object input', () => {
    expect(resolveMargin({ top: 7 })).to.be.eql({
      top: 7,
      right: 7,
      bottom: 7,
      left: 7,
      width: 14,
      height: 14
    });

    expect(resolveMargin({ top: '8' })).to.be.eql({
      top: 8,
      right: 8,
      bottom: 8,
      left: 8,
      width: 16,
      height: 16
    });

    expect(resolveMargin({ top: '8', right: 7 })).to.be.eql({
      top: 8,
      right: 7,
      bottom: 8,
      left: 7,
      width: 14,
      height: 16
    });

    expect(resolveMargin({ top: '8', right: 7, bottom: 9 })).to.be.eql({
      top: 8,
      right: 7,
      bottom: 9,
      left: 7,
      width: 14,
      height: 17
    });
  });
});


describe('labelItem', () => {
  let params;

  beforeEach(() => {
    params = {
      x: 0,
      y: 0,
      anchor: 'left',
      color: 'whaleblue',
      label: { text: 'Halloj' },
      labelBounds: { x: 0, y: 0, width: 3, height: 4 },
      labelMeasure: { width: 6, height: 2 },
      renderingArea: { x: 0, y: 0, width: 500, height: 1000 },
      margin: { left: 1, right: 2, top: 3, bottom: 4 },
      shape: 'square',
      shapeSize: 8,
      maxInnerWidth: 8,
      maxInnerHeight: 8,
      symbolPadding: 0,
      data: 'datum',
      align: 0,
      justify: 0,
      isStacked: true,
      isHorizontal: false
    };
  });

  describe('Properties', () => {
    describe('Shape', () => {
      it('should be able to override default properties', () => {
        params.shape = {
          type: 'square',
          size: 12,
          fill: 'myFill',
          stroke: 'myStroke'
        };
        const container = labelItem(params);
        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          type: 'rect',
          width: 12,
          height: 12,
          fill: 'myFill',
          stroke: 'myStroke'
        });
      });

      it('should not be able to override base properties', () => {
        params.shape = {
          type: 'square',
          x: 999,
          y: 777,
          data: 'Nope',
          collider: 'Nope'
        };
        const container = labelItem(params);
        const shapeNode = container.children[0];
        expect(shapeNode).to.not.include({
          x: 999,
          y: 777,
          data: 'Nope',
          collider: 'Nope'
        });
      });

      it('should ommit shape node if not appended', () => {
        params.shape = undefined;
        const container = labelItem(params);
        expect(container.children.length).to.eql(1);
        const node = container.children[0];
        expect(node.type).to.eql('text');
      });
    });

    describe('Symbolpadding', () => {
      it('should adjust for symbolpadding when anchored left', () => {
        params.anchor = 'left';
        params.symbolPadding = 50;
        const container = labelItem(params);
        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 59
        });
      });

      it('should adjust for symbolpadding when anchored right', () => {
        params.anchor = 'right';
        params.symbolPadding = 50;
        const container = labelItem(params);
        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 440
        });
      });
    });

    describe('Max Inner Size', () => {
      it('should use maxInnerWidth as innerWidth if appended and is not stacked', () => {
        params.maxInnerWidth = 150;
        params.isStacked = false;
        params.isHorizontal = false;
        const container = labelItem(params);
        expect(container).to.include({
          width: 153,
          innerWidth: 150
        });
      });

      it('should use maxInnerHeight as innerHeight if appended and is not stacked', () => {
        params.maxInnerHeight = 150;
        params.isStacked = false;
        params.isHorizontal = false;
        const container = labelItem(params);
        expect(container).to.include({
          height: 157,
          innerHeight: 150
        });
      });
    });

    describe('Data', () => {
      it('should bind data to nodes', () => {
        const container = labelItem(params);
        expect(container).to.include({
          data: 'datum'
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          data: 'datum'
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          data: 'datum'
        });
      });
    });

    describe('Anchor', () => {
      it('left', () => {
        params.anchor = 'left';
        params.isStacked = true;
        params.isHorizontal = false;
        const container = labelItem(params);
        expect(container).to.include({
          x: 0,
          y: 0,
          width: 14,
          height: 15,
          innerWidth: 11,
          innerHeight: 8
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 1,
          y: 3,
          width: 8,
          height: 8
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 9,
          y: 5
        });
      });

      it('right', () => {
        params.anchor = 'right';
        params.isStacked = true;
        params.isHorizontal = false;
        const container = labelItem(params);
        expect(container).to.include({
          x: 486,
          y: 0,
          width: 14,
          height: 15,
          innerWidth: 11,
          innerHeight: 8
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 490,
          y: 3,
          width: 8,
          height: 8
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 490,
          y: 5
        });
      });
    });

    describe('Align/Justify', () => {
      beforeEach(() => {
        params.isStacked = false;
        params.isHorizontal = false;
      });

      it('should align shape to maxShapeSize', () => {
        params.maxShapeSize = 16;
        params.align = 1;
        const container = labelItem(params);
        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 9,
          y: 3,
          width: 8,
          height: 8
        });
      });

      it('should based on item properties, justify shape given label is higher', () => {
        params.labelBounds.height = 16;
        params.justify = 1;
        const container = labelItem(params);
        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 1,
          y: 3,
          width: 8,
          height: 8
        });
      });

      it('should based on item properties, justify label given shape is higher', () => {
        params.labelBounds.height = 4;
        params.shapeSize = 16;
        params.justify = 1;
        const container = labelItem(params);
        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 17,
          y: 9
        });
      });

      it('should justify shape and label if maxInnerHeight is higher', () => {
        params.maxInnerHeight = 16;
        params.justify = 1;
        const container = labelItem(params);
        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 1,
          y: 11,
          width: 8,
          height: 8
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 9,
          y: 17
        });
      });
    });

    describe('Margin', () => {
      it('should adjust for left margin anchored left', () => {
        params.margin.left = 50;
        const container = labelItem(params);
        expect(container).to.include({
          x: 0,
          width: 63,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 50
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 58
        });
      });

      it('should adjust for left margin anchored right', () => {
        params.anchor = 'right';
        params.margin.left = 50;
        params.margin.right = 0;
        const container = labelItem(params);
        expect(container).to.include({
          x: 439,
          width: 61,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 492
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 492
        });
      });

      it('should adjust for right margin when anchored left', () => {
        params.margin.left = 0;
        params.margin.right = 50;
        const container = labelItem(params);
        expect(container).to.include({
          x: 0,
          width: 61,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 0
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 8
        });
      });

      it('should adjust for right margin when anchored right', () => {
        params.anchor = 'right';
        params.margin.left = 0;
        params.margin.right = 50;
        const container = labelItem(params);
        expect(container).to.include({
          x: 439,
          width: 61,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          x: 442
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          x: 442
        });
      });

      it('should adjust for top margin', () => {
        params.margin.top = 50;
        params.margin.bottom = 0;
        const container = labelItem(params);
        expect(container).to.include({
          y: 0,
          height: 58,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          y: 50
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          y: 52
        });
      });

      it('should adjust for bottom margin', () => {
        params.margin.top = 0;
        params.margin.bottom = 50;
        const container = labelItem(params);
        expect(container).to.include({
          y: 0,
          height: 58,
          innerWidth: 11
        });

        const shapeNode = container.children[0];
        expect(shapeNode).to.include({
          y: 0
        });

        const labelNode = container.children[1];
        expect(labelNode).to.include({
          y: 2
        });
      });
    });
  });
});
