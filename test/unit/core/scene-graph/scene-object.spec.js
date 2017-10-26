import create from '../../../../src/core/scene-graph/scene-object';
import { create as createRect } from '../../../../src/core/scene-graph/display-objects/rect';
import { create as createLine } from '../../../../src/core/scene-graph/display-objects/line';
import { create as createCircle } from '../../../../src/core/scene-graph/display-objects/circle';
import { create as createContainer } from '../../../../src/core/scene-graph/display-objects/container';

describe('Scene Object', () => {
  let sceneObject;
  let nodeMock;

  beforeEach(() => {
    nodeMock = {
      type: 'mock',
      attrs: {
        a1: 123
      },
      data: 11,
      desc: {
        myProp: 1337
      }
    };

    nodeMock.boundingRect = sinon.stub();
    nodeMock.boundingRect.returns({ x: 0, y: 0, width: 0, height: 0 });

    sceneObject = create(nodeMock);
  });

  it('should expose node type', () => {
    expect(sceneObject.type).to.equal('mock');
  });

  it('should expose node data value', () => {
    expect(sceneObject.data).to.equal(11);
  });

  it('should expose node attributes', () => {
    expect(sceneObject.attrs).to.deep.equal({ a1: 123 });
  });

  it('should expose node desc', () => {
    expect(sceneObject.desc).to.deep.equal({
      myProp: 1337
    });
  });

  it('should expose node bounds, after any transform', () => {
    const bounds = { x: 10, y: 20, width: 30, height: 40 };
    const rect = createRect({ ...bounds, transform: 'translate(5, 15)' });
    rect.resolveLocalTransform();
    sceneObject = create(rect);

    expect(sceneObject.bounds).to.deep.equal({ x: 15, y: 35, width: 30, height: 40 });
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

  describe('should expose node collider as a geometrical shape', () => {
    it('rect', () => {
      const rect = createRect({ x: 10, y: 20, width: 30, height: 40 });
      sceneObject = create(rect);
      expect(sceneObject.collider).to.deep.equal({
        type: 'rect',
        x: 10,
        y: 20,
        width: 30,
        height: 40
      });
    });

    it('line', () => {
      const line = createLine({ x1: 10, y1: 20, x2: 30, y2: 40 });
      sceneObject = create(line);
      expect(sceneObject.collider).to.deep.equal({
        type: 'line',
        x1: 10,
        y1: 20,
        x2: 30,
        y2: 40
      });
    });

    it('circle', () => {
      const circle = createCircle({ cx: 10, cy: 20, r: 30 });
      sceneObject = create(circle);
      expect(sceneObject.collider).to.deep.equal({
        type: 'circle',
        cx: 10,
        cy: 20,
        r: 30
      });
    });

    it('polygon', () => {
      const circle = createCircle({
        cx: 10,
        cy: 20,
        r: 30,
        collider: {
          type: 'polygon',
          vertices: [
            { x: 0, y: 25 },
            { x: 25, y: 0 },
            { x: 50, y: 25 }
          ]
        }
      });
      sceneObject = create(circle);
      expect(sceneObject.collider).to.deep.equal({
        type: 'path',
        d: 'M0 25 L25 0 L50 25 L0 25 Z'
      });
    });

    it('bounds', () => {
      const container = createContainer({ collider: { type: 'bounds' } });
      container.addChild(createRect({ x: 10, y: 20, width: 30, height: 40 }));
      sceneObject = create(container);
      expect(sceneObject.collider).to.deep.equal({
        type: 'rect',
        x: 10,
        y: 20,
        width: 30,
        height: 40
      });
    });

    it('and include any transform on the node', () => {
      const rect = createRect({ x: 10, y: 20, width: 30, height: 40, transform: 'translate(5, 15)' });
      rect.resolveLocalTransform();
      sceneObject = create(rect);
      expect(sceneObject.collider).to.deep.equal({
        type: 'rect',
        x: 15,
        y: 35,
        width: 30,
        height: 40
      });
    });

    it('and handle if node doesnt have any collider', () => {
      const rect = createRect({ x: 10, y: 20, width: 30, height: 40, collider: { type: null } });
      sceneObject = create(rect);
      expect(sceneObject.collider).to.equal(null);
    });
  });
});
