import Container, { create as createContainer } from '../../../../../src/core/scene-graph/display-objects/container';
import { create as createRect } from '../../../../../src/core/scene-graph/display-objects/rect';
import GeoRect from '../../../../../src/core/geometry/rect';

describe('Container', () => {
  let container;

  describe('Constructor', () => {
    it('should instantiate a new Container', () => {
      container = createContainer();
      expect(container).to.be.an.instanceof(Container);
    });

    it('should not have a collider by default', () => {
      container = createContainer();
      expect(container.collider()).to.equal(null);
    });

    it('should accept arguments', () => {
      container = createContainer({ collider: { type: 'rect' } });
      expect(container.collider()).to.be.a('object');
      expect(container.collider().fn).to.be.an.instanceof(GeoRect);
      expect(container.collider().type).to.equal('rect');
    });
  });

  describe('Set', () => {
    it('should set correct values', () => {
      container = createContainer();
      container.set({ collider: { type: 'rect' } });
      expect(container.collider()).to.be.a('object');
      expect(container.collider().fn).to.be.an.instanceof(GeoRect);
      expect(container.collider().type).to.equal('rect');
    });

    it('should handle no arguments', () => {
      container = createContainer();
      container.set();
      expect(container.collider()).to.equal(null);
    });

    it('should be able to disable the collider', () => {
      container = createContainer({ collider: { type: 'rect' } });
      container.set({ collider: { type: null } });
      expect(container.collider()).to.equal(null);
    });
  });

  describe('BoundingRect', () => {
    it('should return a zero sized rect if no children have been added', () => {
      container = createContainer();
      expect(container.boundingRect()).to.deep.equal({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should return correct value if container and children are without a transformation', () => {
      container = createContainer();
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20 }), // Height
        createRect({ x: 0, y: 0, width: 10, height: 2 }), // Width
        createRect({ x: -10, y: -20, width: 1, height: 2 }) // x,y
      ]);
      expect(container.boundingRect()).to.deep.equal({ x: -10, y: -20, width: 20, height: 50 });
    });

    it('should return correct value with a transformation on its children', () => {
      container = createContainer();
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20, transform: 'scale(2, 3)' }),
        createRect({ x: 0, y: 0, width: 10, height: 2, transform: 'scale(2, 3)' }),
        createRect({ x: -10, y: -20, width: 1, height: 2, transform: 'scale(2, 3)' })
      ]);
      container.children.forEach(c => c.resolveGlobalTransform());
      expect(container.boundingRect(true)).to.deep.equal({ x: -20, y: -60, width: 40, height: 150 });
    });

    it('should return correct value with a transformation the container and its children', () => {
      container = createContainer({ transform: 'scale(2, 3)' });
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20, transform: 'translate(1, 2)' }),
        createRect({ x: 0, y: 0, width: 10, height: 2, transform: 'translate(1, 2)' }),
        createRect({ x: -10, y: -20, width: 1, height: 2, transform: 'translate(1, 2)' })
      ]);
      container.children.forEach(c => c.resolveGlobalTransform());
      expect(container.boundingRect(true)).to.deep.equal({ x: -18, y: -54, width: 40, height: 150 });
    });

    it('should return correct value a scale transformation', () => {
      container = createContainer({ transform: 'scale(2, 3)' });
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20 }), // Height
        createRect({ x: 0, y: 0, width: 10, height: 2 }), // Width
        createRect({ x: -10, y: -20, width: 1, height: 2 }) // x,y
      ]);
      container.children.forEach(c => c.resolveGlobalTransform());
      expect(container.boundingRect(true)).to.deep.equal({ x: -20, y: -60, width: 40, height: 150 });
    });

    it('should return correct value with a translate transformation', () => {
      container = createContainer({ transform: 'translate(2, 3)' });
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20 }), // Height
        createRect({ x: 0, y: 0, width: 10, height: 2 }), // Width
        createRect({ x: -10, y: -20, width: 1, height: 2 }) // x,y
      ]);
      container.children.forEach(c => c.resolveGlobalTransform());
      expect(container.boundingRect(true)).to.deep.equal({ x: -8, y: -17, width: 20, height: 50 });
    });

    it('should return correct value with a rotate transformation', () => {
      container = createContainer({ transform: 'rotate(45)' });
      container.addChildren([
        createRect({ x: 5, y: 10, width: 1, height: 20 }),
        createRect({ x: 0, y: 0, width: 10, height: 2 }),
        createRect({ x: -10, y: -20, width: 1, height: 2 })
      ]);
      container.children.forEach(c => c.resolveGlobalTransform());
      expect(container.boundingRect(true)).to.deep.equal({ x: -17.677669529663685, y: -21.213203435596427, width: 25.455844122715707, height: 46.66904755831214 });
    });
  });
});
