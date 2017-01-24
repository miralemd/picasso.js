/* eslint no-unused-expressions: 0*/

import { crispifierFactory } from '../../../../src/core/transposer/crispifier';

describe('crispifier', () => {
  it('should not modify rects with 0 stroke width', () => {
    let crispifier = crispifierFactory();

    let dummy = {
      type: 'rect',
      x: 100,
      y: 150,
      width: 200,
      height: 250,
      strokeWidth: 0
    };

    crispifier(dummy);

    expect(dummy.x).to.equal(100);
    expect(dummy.y).to.equal(150);
    expect(dummy.width).to.equal(200);
    expect(dummy.height).to.equal(250);
  });

  it('should modify rects with uneven stroke width', () => {
    let crispifier = crispifierFactory();

    let dummy = {
      type: 'rect',
      x: 100,
      y: 150,
      width: 200,
      height: 250,
      strokeWidth: 1
    };

    crispifier(dummy);

    expect(dummy.x).to.equal(99.5);
    expect(dummy.y).to.equal(149.5);
    expect(dummy.width).to.equal(200);
    expect(dummy.height).to.equal(250);
  });

  it('should modify lines with uneven stroke width', () => {
    let crispifier = crispifierFactory();

    let dummy = {
      type: 'line',
      x1: 100,
      y1: 150,
      x2: 100,
      y2: 150,
      strokeWidth: 3
    };

    crispifier(dummy);

    expect(dummy.x1).to.equal(99.5);
    expect(dummy.y1).to.equal(149.5);
    expect(dummy.x2).to.equal(99.5);
    expect(dummy.y2).to.equal(149.5);
  });

  it('should not modify lines with even stroke width', () => {
    let crispifier = crispifierFactory();

    let dummy = {
      type: 'line',
      x1: 100,
      y1: 150,
      x2: 100,
      y2: 150,
      strokeWidth: 10
    };

    crispifier(dummy);

    expect(dummy.x1).to.equal(100);
    expect(dummy.y1).to.equal(150);
    expect(dummy.x2).to.equal(100);
    expect(dummy.y2).to.equal(150);
  });

  it('should not modify non-straight lines', () => {
    let crispifier = crispifierFactory();

    let dummy = {
      type: 'line',
      x1: 100,
      y1: 150,
      x2: 200,
      y2: 250,
      strokeWidth: 3
    };

    crispifier(dummy);

    expect(dummy.x1).to.equal(100);
    expect(dummy.y1).to.equal(150);
    expect(dummy.x2).to.equal(200);
    expect(dummy.y2).to.equal(250);
  });

  it('should not modify rects with empty crispmap', () => {
    let crispifier = crispifierFactory({}); // empty crispmap here

    let dummyRect = {
      type: 'rect',
      x: 100,
      y: 150,
      width: 200,
      height: 250,
      strokeWidth: 1
    };

    let dummyLine = {
      type: 'line',
      x1: 100,
      y1: 150,
      x2: 100,
      y2: 150,
      strokeWidth: 3
    };

    crispifier(dummyRect);
    crispifier(dummyLine);

    expect(dummyRect.x).to.equal(100);
    expect(dummyRect.y).to.equal(150);
    expect(dummyRect.width).to.equal(200);
    expect(dummyRect.height).to.equal(250);

    expect(dummyLine.x1).to.equal(100);
    expect(dummyLine.y1).to.equal(150);
    expect(dummyLine.x2).to.equal(100);
    expect(dummyLine.y2).to.equal(150);
  });
});
