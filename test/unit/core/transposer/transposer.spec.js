/* eslint no-unused-expressions: 0*/

import { transposer } from '../../../../src/core/transposer/transposer';

describe('transposer', () => {
  let draw = transposer();

  it('should return correct opposite keys', () => {
    draw.vertical = true;

    // Get the opposite key to what you put in, height when you put in width etc
    expect(draw.evaluateKey('width')).to.equal('height');
    expect(draw.evaluateKey('height')).to.equal('width');

    // Same applies to coordinates
    expect(draw.evaluateKey('x')).to.equal('y');
    expect(draw.evaluateKey('y')).to.equal('x');

    // With multiple X and Ys
    expect(draw.evaluateKey('x1')).to.equal('y1');
    expect(draw.evaluateKey('y2')).to.equal('x2');

    // With CX and CY
    expect(draw.evaluateKey('cx')).to.equal('cy');
    expect(draw.evaluateKey('cy')).to.equal('cx');
  });

  it('should return correct coordinates', () => {
    // Make sure the width and height are set,
    // all coordinates will be coordinate * width or height
    draw.width = 2;
    draw.height = 3;
    draw.x = 0;
    draw.y = 0;

    draw.vertical = false;

    // Check if the coordinates respond correctly to the values
    expect(draw.transposeCoordinate('width', 2)).to.equal(4);
    expect(draw.transposeCoordinate('height', 3)).to.equal(9);

    expect(draw.transposeCoordinate('x1', 4)).to.equal(8);
    expect(draw.transposeCoordinate('y2', 0.5)).to.equal(1.5);

    expect(draw.transposeCoordinate('x', 5)).to.equal(10);
    expect(draw.transposeCoordinate('y', 0.5)).to.equal(1.5);

    // Flip it all
    draw.vertical = true;

    expect(draw.transposeCoordinate('y', 0.25, { height: 0.5 })).to.equal(0.75);
    expect(draw.transposeCoordinate('x', 0.75, { height: 0.25 })).to.equal(1.5);

    // Check so that it handles other values Ok
    expect(draw.transposeCoordinate('height', 'test')).to.equal('test');
    expect(draw.transposeCoordinate('height', NaN)).to.be.NaN;
  });

  it('should handle basic pushing correctly', () => {
    const dummy1 = { dummy1: 'dummy1' };
    const dummy2 = { dummy2: 'dummy2' };

    draw = transposer(dummy2);

    draw.push(dummy1);

    expect(draw.storage[0]).to.equal(dummy2);
    expect(draw.storage[1]).to.equal(dummy1);
  });

  it('should export the expected objects in horizontal mode', () => {
    const dummy = {
      x: 0.25,
      y: 0.75,
      width: 0.375,
      height: 0.125
    };

    draw = transposer(dummy);
    draw.width = 100;
    draw.height = 100;
    draw.x = 0;
    draw.y = 0;

    const output = draw.output();

    expect(output[0].x).to.equal(25);
    expect(output[0].y).to.equal(75);
    expect(output[0].width).to.equal(37.5);
    expect(output[0].height).to.equal(12.5);
  });

  it('should export the expected objects in vertical mode', () => {
    const dummy = {
      x: 0.25,
      y: 0.75,
      width: 0.375,
      height: 0.125
    };

    draw = transposer(dummy);
    draw.width = 100;
    draw.height = 100;
    draw.x = 0;
    draw.y = 0;
    draw.vertical = true;

    const output = draw.output();

    expect(output[0].y).to.equal(25);
    expect(output[0].x).to.equal(75);
    expect(output[0].height).to.equal(37.5);
    expect(output[0].width).to.equal(12.5);
  });
});
