import { resetGradients, processGradients } from '../../../../../src/web/renderer/svg-renderer/svg-gradient';

/* eslint no-unused-expressions: 0 */

describe('svg-gradient', () => {
  let items;

  const dummyGradientObject = (secondOffset = 0.5) => ({
    type: 'rect',
    width: 500,
    height: 500,
    x: 50,
    y: 100,
    fill: {
      type: 'gradient',
      degree: 90,
      orientation: 'radial',
      stops: [
        {
          offset: 0,
          color: 'blue'
        },
        {
          offset: secondOffset,
          color: 'green'
        }
      ]
    }
  });

  const dummyNonGradientObject = () => ({
    type: 'rect',
    width: 500,
    height: 500,
    x: 50,
    y: 100,
    fill: 'red'
  });

  beforeEach(() => {
    items = [];
    resetGradients();
  });

  describe('processGradients', () => {
    it('should create gradients properly without crashing', () => {
      items = processGradients([dummyGradientObject()]);

      expect(items).to.be.an.array;
      expect(items).to.have.length(2);

      expect(items[0].type).to.be.equal('defs');
      expect(items[0].children).to.be.an.array;
      expect(items[0].children).to.have.length(1);

      expect(items[1].type).to.be.equal('rect');
      expect(items[1].children).to.be.undefined;
      expect(items[1].fill).to.include('url(#');
    });

    it('should cache gradients of the same type', () => {
      items = processGradients([dummyGradientObject(), dummyGradientObject()]);

      expect(items).to.be.an.array;
      expect(items).to.have.length(3);

      expect(items[0].type).to.be.equal('defs');
      expect(items[0].children).to.be.an.array;
      expect(items[0].children).to.have.length(1);

      expect(items[1].type).to.be.equal('rect');
      expect(items[1].fill).to.include(items[0].children[0].id);

      expect(items[2].type).to.be.equal('rect');
      expect(items[2].fill).to.include(items[0].children[0].id);
    });

    it('should not cache non-similar gradients', () => {
      items = processGradients([dummyGradientObject(0.2), dummyGradientObject(0.7)]);

      expect(items).to.be.an.array;
      expect(items).to.have.length(3);

      expect(items[0].type).to.be.equal('defs');
      expect(items[0].children).to.be.an.array;
      expect(items[0].children).to.have.length(2);

      expect(items[1].type).to.be.equal('rect');
      expect(items[1].fill).to.include(items[0].children[0].id);

      expect(items[2].type).to.be.equal('rect');
      expect(items[2].fill).to.include(items[0].children[1].id);
    });

    it('should not create defs if no gradients', () => {
      items = processGradients([dummyNonGradientObject(), dummyNonGradientObject()]);

      expect(items).to.be.an.array;
      expect(items).to.have.length(2);

      expect(items[0].type).to.not.be.equal('defs');
      expect(items[1].type).to.not.be.equal('defs');
    });
  });
});
