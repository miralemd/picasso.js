import { getMinimumViableNumber, labelItem, resolvePadding } from '../../../../../src/core/chart-components/legend-cat/label-item';

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

describe('resolvePadding', () => {
  it('should handle invalid formats', () => {
    let defaultResult = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    };

    expect(resolvePadding()).to.be.eql(defaultResult);
    expect(resolvePadding(null)).to.be.eql(defaultResult);
    expect(resolvePadding(0)).to.be.eql(defaultResult);
    expect(resolvePadding({})).to.be.eql(defaultResult);
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

    expect(resolvePadding(5)).to.be.eql(expectedResult);
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

    expect(resolvePadding('5')).to.be.eql(expectedResult);
    expect(resolvePadding('5px')).to.be.eql(expectedResult);
    expect(resolvePadding('5px 5px')).to.be.eql(expectedResult);
    expect(resolvePadding('5px 5px 5px')).to.be.eql(expectedResult);
    expect(resolvePadding('5px 5px 5px 5px')).to.be.eql(expectedResult);
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

    expect(resolvePadding('9px 8px 6px 5px')).to.be.eql(expectedResult);
  });

  it('should handle object input', () => {
    expect(resolvePadding({ top: 7 })).to.be.eql({
      top: 7,
      right: 7,
      bottom: 7,
      left: 7,
      width: 14,
      height: 14
    });

    expect(resolvePadding({ top: '8' })).to.be.eql({
      top: 8,
      right: 8,
      bottom: 8,
      left: 8,
      width: 16,
      height: 16
    });

    expect(resolvePadding({ top: '8', right: 7 })).to.be.eql({
      top: 8,
      right: 7,
      bottom: 8,
      left: 7,
      width: 14,
      height: 16
    });

    expect(resolvePadding({ top: '8', right: 7, bottom: 9 })).to.be.eql({
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
    let padding = 5;

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
      renderingArea: undefined,
      padding
    });

    let expectedContainer = {
      type: 'container',
      x: 5,
      y: 10,
      width: 4 + innerHeight + (padding * 3), // Padding left, padding right, padding between items
      height: innerHeight + (padding * 2)
    };

    let expectedSymbol = {
      type: 'rect',
      fill: 'black',
      x: 10,
      y: 15,
      width: innerHeight,
      height: innerHeight
    };

    let expectedText = {
      type: 'text',
      anchor: 'start',
      x: expectedSymbol.x + expectedSymbol.width + padding,
      y: expectedSymbol.y + innerHeight + (-1),
      maxWidth: expectedContainer.width - expectedSymbol.width - (padding * 3),
      text: 'Test',
      fill: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial'
    };

    assertNodeProperties(container, expectedContainer);
    expect(container.children).to.deep.include(expectedSymbol);
    expect(container.children).to.deep.include(expectedText);
  });

  it('should handle basic right-aligned instructions', () => {
    let innerHeight = 12;
    let padding = 5;

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
      padding
    });

    let expectedContainer = {
      type: 'container',
      x: 200 - 4 - innerHeight - (padding * 3),
      y: 0,
      width: 4 + innerHeight + (padding * 3), // Padding left, padding right, padding between items
      height: innerHeight + (padding * 2)
    };

    let expectedSymbol = {
      type: 'rect',
      fill: 'black',
      x: 200 - innerHeight - padding,
      y: 5,
      width: innerHeight,
      height: innerHeight
    };

    let expectedText = {
      type: 'text',
      anchor: 'end',
      x: expectedSymbol.x - padding,
      y: expectedSymbol.y + innerHeight + (-1),
      maxWidth: expectedContainer.width - expectedSymbol.width - (padding * 3),
      text: 'Test',
      fill: 'black',
      fontSize: `${innerHeight}px`,
      fontFamily: 'Arial'
    };

    assertNodeProperties(container, expectedContainer);
    expect(container.children).to.deep.include(expectedSymbol);
    expect(container.children).to.deep.include(expectedText);
  });
});
