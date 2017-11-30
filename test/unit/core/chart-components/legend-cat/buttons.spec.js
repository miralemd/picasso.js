import extend from 'extend';
import createButton from '../../../../../src/core/chart-components/legend-cat/buttons';

function assertNodeProperties(node, expected) {
  Object.keys(expected).forEach((key) => {
    expect(node).to.have.property(key, expected[key]);
  });
}

describe('createButton', () => {
  it('should handle basic formats', () => {
    const result = createButton({
      x: 10,
      y: 12,
      width: 100,
      height: 120,
      direction: 'up',
      action: 'up',
      rect: {},
      symbol: {
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 1,
        size: 0.5
      }
    });

    const expectedContainer = {
      type: 'container',
      x: 10,
      y: 12,
      width: 100,
      height: 120
    };
    const expectedSymbol = {
      type: 'path',
      fill: 'red',
      d: 'M35 97 L60 47 L85 97 L35 97 Z',
      stroke: 'blue',
      strokeWidth: 1
    };
    const expectedRect = extend({}, expectedContainer, { type: 'rect' });
    const expectedCollider = extend({}, expectedContainer, { type: 'rect' });

    assertNodeProperties(result, expectedContainer);
    assertNodeProperties(result.collider, expectedCollider);
    assertNodeProperties(result.children[0], expectedRect);
    expect(result.children[1]).to.deep.equal(expectedSymbol);
  });
});
