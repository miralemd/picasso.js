import create from '../../../../src/core/scene-graph/scene-object';

describe('Scene Object', () => {
  let sceneObject;
  let nodeMock;

  beforeEach(() => {
    nodeMock = {
      type: 'mock',
      attrs: {
        a1: 123
      },
      data: 1
    };

    nodeMock.boundingRect = sinon.stub();
    nodeMock.boundingRect.returns({ x: 0, y: 0, width: 0, height: 0 });

    sceneObject = create(nodeMock);
  });

  it('should expose node type', () => {
    expect(sceneObject.type).to.equal('mock');
  });

  it('should expose node data', () => {
    expect(sceneObject.data).to.equal(1);
  });

  it('should expose node attributes', () => {
    expect(sceneObject.attrs).to.deep.equal({ a1: 123 });
  });

  it('should expose node bounds, after any transform', () => {
    const bounds = { x: 10, y: 20, width: 30, height: 40 };
    nodeMock.boundingRect.returns(bounds);
    sceneObject = create(nodeMock);

    expect(sceneObject.bounds).to.deep.equal(bounds);
    expect(nodeMock.boundingRect).to.have.been.calledWith(true); // Called with true param to include transform
  });

  it('should expose node bounds, exluding the dpi scale factor', () => {
    const bounds = { x: 10, y: 20, width: 30, height: 40 };
    nodeMock.boundingRect.returns(bounds);
    nodeMock.stage = {
      dpi: 2
    };
    sceneObject = create(nodeMock);

    expect(sceneObject.bounds).to.deep.equal({
      x: 10 / 2,
      y: 20 / 2,
      width: 30 / 2,
      height: 40 / 2
    });
  });

  it('should handle when node doesnt expose a way to get the bounding rect', () => {
    nodeMock.boundingRect = undefined;
    sceneObject = create(nodeMock);

    expect(sceneObject.bounds).to.deep.equal({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
  });
});
