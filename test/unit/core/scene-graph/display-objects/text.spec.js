import Text, { create as createText } from '../../../../../src/core/scene-graph/display-objects/text';

describe('Text', () => {
  let node;
  let def;

  beforeEach(() => {
    def = {
      text: 'testing',
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    };
  });

  describe('Constructor', () => {
    it('should instantiate a new Text', () => {
      node = createText();
      expect(node).to.be.an.instanceof(Text);
      expect(node.attrs.text).to.be.undefined;
      expect(node.attrs.x).to.be.equal(0);
      expect(node.attrs.y).to.be.equal(0);
      expect(node.attrs.dx).to.be.equal(0);
      expect(node.attrs.dy).to.be.equal(0);
      expect(node.collider()).to.be.null;
    });

    it('should accept arguments', () => {
      node = createText({
        text: 'testing',
        x: 1,
        y: 2,
        dx: 3,
        dy: 4
      });
      expect(node).to.be.an.instanceof(Text);
      expect(node.attrs.text).to.equal('testing');
      expect(node.attrs.x).to.equal(1);
      expect(node.attrs.y).to.equal(2);
      expect(node.attrs.dx).to.equal(3);
      expect(node.attrs.dy).to.equal(4);
      expect(node.collider()).to.be.null;
    });
  });

  describe('BoundingRect', () => {
    it('should handle default values', () => {
      node = createText();
      expect(node.boundingRect()).to.deep.equal({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should return correct value without transformation', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      node = createText(def);
      expect(node.boundingRect()).to.deep.equal({ x: 4, y: -39, width: 50, height: 60 });
    });

    it('should return correct value with a scale transforma', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'scale(2, 3)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.boundingRect(true)).to.deep.equal({ x: 8, y: -117, width: 100, height: 180 });
    });

    it('should return correct value with a translate transform', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'translate(1, 2)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.boundingRect(true)).to.deep.equal({ x: 5, y: -37, width: 50, height: 60 });
    });

    it('should return correct value with a rotate transformation', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'rotate(90)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.boundingRect(true)).to.deep.equal({ x: -21, y: 3.999999999999998, width: 60, height: 50 });
    });

    it('should return correct value with a negative vector direction', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      node = createText(def);
      expect(node.boundingRect()).to.deep.equal({ x: -4, y: -51, width: 50, height: 60 });
    });

    it('should return correct value with max values', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.maxWidth = 20;
      def.height = 60;
      node = createText(def);
      expect(node.boundingRect()).to.deep.equal({ x: -4, y: -51, width: 20, height: 60 });
    });

    it('should return correct value with text-anchor middle', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      def.anchor = 'middle';
      node = createText(def);
      expect(node.boundingRect()).to.deep.equal({ x: -29, y: -51, width: 50, height: 60 });
    });

    it('should return correct value with text-anchor end', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      def.anchor = 'end';
      node = createText(def);
      expect(node.boundingRect()).to.deep.equal({ x: -54, y: -51, width: 50, height: 60 });
    });
  });

  describe('Bounds', () => {
    it('should handle default values', () => {
      node = createText();
      expect(node.bounds()).to.deep.equal([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]);
    });

    it('should return correct value without transformation', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      node = createText(def);
      expect(node.bounds()).to.deep.equal([
        { x: 4, y: -39 },
        { x: 54, y: -39 },
        { x: 54, y: 21 },
        { x: 4, y: 21 }
      ]);
    });

    it('should return correct value with a scale transforma', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'scale(2, 3)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.bounds(true)).to.deep.equal([
        { x: 8, y: -117 },
        { x: 108, y: -117 },
        { x: 108, y: 63 },
        { x: 8, y: 63 }
      ]);
    });

    it('should return correct value with a translate transform', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'translate(1, 2)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.bounds(true)).to.deep.equal([
        { x: 5, y: -37 },
        { x: 55, y: -37 },
        { x: 55, y: 23 },
        { x: 5, y: 23 }
      ]);
    });

    it('should return correct value with a rotate transformation', () => {
      def.x = 1;
      def.y = 2;
      def.dx = 3;
      def.dy = 4;
      def.width = 50;
      def.height = 60;
      def.transform = 'rotate(90)';
      node = createText(def);
      node.resolveLocalTransform();
      expect(node.bounds(true)).to.deep.equal([
        { x: -21, y: 3.999999999999998 },
        { x: 39, y: 3.999999999999998 },
        { x: 39, y: 54 },
        { x: -21, y: 54 }
      ]);
    });

    it('should return correct value with a negative vector direction', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      node = createText(def);
      expect(node.bounds()).to.deep.equal([
        { x: -4, y: -51 },
        { x: 46, y: -51 },
        { x: 46, y: 9 },
        { x: -4, y: 9 }
      ]);
    });

    it('should return correct value with max values', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.maxWidth = 20;
      def.height = 60;
      node = createText(def);
      expect(node.bounds()).to.deep.equal([
        { x: -4, y: -51 },
        { x: 16, y: -51 },
        { x: 16, y: 9 },
        { x: -4, y: 9 }
      ]);
    });

    it('should return correct value with text-anchor middle', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      def.anchor = 'middle';
      node = createText(def);
      expect(node.bounds()).to.deep.equal([
        { x: -29, y: -51 },
        { x: 21, y: -51 },
        { x: 21, y: 9 },
        { x: -29, y: 9 }
      ]);
    });

    it('should return correct value with text-anchor end', () => {
      def.x = -1;
      def.y = -2;
      def.dx = -3;
      def.dy = -4;
      def.width = 50;
      def.height = 60;
      def.anchor = 'end';
      node = createText(def);
      expect(node.bounds()).to.deep.equal([
        { x: -54, y: -51 },
        { x: -4, y: -51 },
        { x: -4, y: 9 },
        { x: -54, y: 9 }
      ]);
    });
  });
});
