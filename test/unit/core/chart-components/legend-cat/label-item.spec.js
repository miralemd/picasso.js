import { getMinimumViableNumber, labelItem, resolveMargin } from '../../../../../src/core/chart-components/legend-cat/label-item';

function assertNodeProperties(node, expected) {
  Object.keys(expected).forEach((key) => {
    expect(node).to.have.property(key, expected[key]);
  });
}

// let rendererOutput = [];

let renderer = {
  appendTo: () => {},
  render: p => (p),
  size: () => {},
  measureText: ({ text, fontSize }) => ({ width: parseInt(text.length, 10), height: parseInt(fontSize.replace('px', ''), 10) })
};

describe('getMinimumViableNumber', () => {
  it('should handle invalid numbers', () => {
    expect(getMinimumViableNumber(NaN, NaN, NaN)).to.be.equal(Infinity);
    expect(getMinimumViableNumber(-Infinity, NaN, NaN)).to.be.equal(-Infinity);
  });

  it('should return correct minimum viable number', () => {
    expect(getMinimumViableNumber(NaN, 0.13)).to.be.equal(0.13);
    expect(getMinimumViableNumber(200, 400)).to.be.equal(200);
    expect(getMinimumViableNumber(308, -150, 8504, 605)).to.be.equal(-150);
  });
});

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
  it('should handle basic left-aligned instructions', () => {
    let innerHeight = 12;
    let margin = 5;

    let container = labelItem({
      x: 5,
      y: 10,
      maxWidth: undefined,
      maxHeight: undefined,
      color: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      labelText: 'Test',
      renderer,
      align: undefined,
      renderingArea: { x: 0, y: 0, width: 200, height: 200 },
      margin,
      data: { index: 1 }
    });

    let expectedContainer = {
      type: 'container',
      x: 5,
      y: 10,
      width: 4 + innerHeight + (margin * 3), // Padding left, margin right, margin between items
      height: innerHeight + (margin * 2),
      dataIndex: 1
    };

    let expectedSymbol = {
      type: 'rect',
      fill: 'black',
      x: 10,
      y: 15,
      width: innerHeight,
      height: innerHeight,
      dataIndex: 1
    };

    let expectedText = {
      type: 'text',
      anchor: 'start',
      x: expectedSymbol.x + expectedSymbol.width + margin,
      y: expectedSymbol.y + innerHeight + (-1),
      maxWidth: (expectedContainer.width - expectedSymbol.width - (margin * 3)) + 1,
      text: 'Test',
      fill: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      dataIndex: 1
    };

    assertNodeProperties(container, expectedContainer);
    expect(container.children).to.deep.include(expectedSymbol);
    expect(container.children).to.deep.include(expectedText);
  });

  it('should handle basic right-aligned instructions', () => {
    let innerHeight = 12;
    let margin = 5;

    let container = labelItem({
      x: 0,
      y: 0,
      maxWidth: undefined,
      maxHeight: undefined,
      color: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      labelText: 'Test',
      renderer,
      align: 'right',
      renderingArea: {
        x: 0,
        y: 0,
        width: 200,
        height: 200
      },
      margin,
      data: { index: 1 }
    });

    let expectedContainer = {
      type: 'container',
      x: 200 - 4 - innerHeight - (margin * 3),
      y: 0,
      width: 4 + innerHeight + (margin * 3), // Padding left, margin right, margin between items
      height: innerHeight + (margin * 2)
    };

    let expectedSymbol = {
      type: 'rect',
      fill: 'black',
      x: 200 - innerHeight - margin,
      y: 5,
      width: innerHeight,
      height: innerHeight,
      dataIndex: 1
    };

    let expectedText = {
      type: 'text',
      anchor: 'end',
      x: expectedSymbol.x - margin,
      y: expectedSymbol.y + innerHeight + (-1),
      maxWidth: (expectedContainer.width - expectedSymbol.width - (margin * 3)) + 1,
      text: 'Test',
      fill: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      dataIndex: 1
    };

    assertNodeProperties(container, expectedContainer);
    expect(container.children).to.deep.include(expectedSymbol);
    expect(container.children).to.deep.include(expectedText);
  });

  it('should set maxWidth to edge of rendering area', () => {
    let innerHeight = 12;
    let margin = 5;

    let renderingArea = { x: 0, y: 0, width: 35, height: 200 };

    let container = labelItem({
      x: 5,
      y: 10,
      maxWidth: undefined,
      maxHeight: undefined,
      color: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      labelText: 'AbcdeAbcdeAbcdeAbcde', // 20 characters
      renderer,
      align: undefined,
      renderingArea,
      margin,
      data: { index: 3 }
    });

    let expectedContainer = {
      type: 'container',
      x: 5,
      y: 10,
      width: renderingArea.width - margin, // Padding left, margin right, margin between items
      height: innerHeight + (margin * 2)
    };

    let expectedSymbol = {
      type: 'rect',
      fill: 'black',
      x: 10,
      y: 15,
      width: innerHeight,
      height: innerHeight,
      dataIndex: 3
    };

    let expectedText = {
      type: 'text',
      anchor: 'start',
      x: expectedSymbol.x + expectedSymbol.width + margin,
      y: expectedSymbol.y + innerHeight + (-1),
      maxWidth: (expectedContainer.width - expectedSymbol.width - (margin * 3)) + 1,
      text: 'AbcdeAbcdeAbcdeAbcde',
      fill: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial',
      dataIndex: 3
    };

    assertNodeProperties(container, expectedContainer);
    expect(container.children).to.deep.include(expectedSymbol);
    expect(container.children).to.deep.include(expectedText);
  });
});
