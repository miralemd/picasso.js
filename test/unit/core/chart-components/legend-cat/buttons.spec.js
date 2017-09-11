import extend from 'extend';
import createButton from '../../../../../src/core/chart-components/legend-cat/buttons';

function assertNodeProperties(node, expected) {
  Object.keys(expected).forEach((key) => {
    expect(node).to.have.property(key, expected[key]);
  });
}

describe('createButton', () => {
  it('should handle basic formats', () => {
    const result = createButton({ x: 10, y: 12, width: 100, height: 120, direction: 'up', data: {}, rect: {}, line: {} });

    const expectedContainer = {
      type: 'container',
      x: 10,
      y: 12,
      width: 100,
      height: 120
    };

    const expectedCollider = extend({}, expectedContainer, { type: 'rect' });

    assertNodeProperties(result, expectedContainer);
    assertNodeProperties(result.collider, expectedCollider);
    expect(result.children).to.have.a.lengthOf(2);
  });
});
