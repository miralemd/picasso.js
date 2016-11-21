import { measureText } from '../../../../../src/web/renderer/canvas-renderer/text-metrics';

describe('text-metrics', () => {
  describe('measureText', () => {
    let cacheId = 0,
      fontWasUnset = false;

    const sandbox = sinon.sandbox.create(),
      canvasContextMock = {
        font: '',
        measureText: sandbox.spy(() => {
          if (!canvasContextMock.font) fontWasUnset = true;
          return { width: 150 };
        })
      },
      canvasMock = {
        getContext: sandbox.spy(() => canvasContextMock)
      },
      argument = {
        text: 'Test',
        fontSize: 0,
        fontFamily: 'Arial'
      };

    global.document = {
      createElement: sandbox.spy(() => canvasMock)
    };

    afterEach(() => {
      fontWasUnset = false;
      canvasContextMock.font = '';
      sandbox.reset();
    });

    after(() => {
      delete global.document;
    });

    it('should return correct result', () => {
      argument.fontSize = ++cacheId;

      const result = measureText(argument);

      expect(result).to.deep.equal({ width: 150, height: 180 });
    });

    it('should set the correct font before firing measureText', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.font).to.equal(`${cacheId} Arial`);
      expect(fontWasUnset).to.equal(false);
    });

    it('should fire measureText twice with correct arguments', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.calledTwice).to.equal(true);
      expect(canvasContextMock.measureText.calledWith('Test')).to.equal(true);
      expect(canvasContextMock.measureText.calledWith('M')).to.equal(true);
    });

    it('should reuse the previously created canvas element', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      const preCallCount = global.document.createElement.callCount;

      argument.fontSize = ++cacheId;

      measureText(argument);

      const postCallCount = global.document.createElement.callCount;

      expect(preCallCount).to.equal(postCallCount);
    });

    it('should reuse past width calculations if arguments match previous use case', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('Test').calledOnce).to.equal(true);

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('Test').calledOnce).to.equal(true);
    });

    it('should not reuse past width calculations if arguments does not match previous use case', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('Test').calledOnce).to.equal(true);

      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('Test').calledTwice).to.equal(true);
    });

    it('should reuse past height calculations if arguments match previous use case', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('M').calledOnce).to.equal(true);

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('M').calledOnce).to.equal(true);
    });

    it('should not reuse past height calculations if arguments does not match previous use case', () => {
      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('M').calledOnce).to.equal(true);

      argument.fontSize = ++cacheId;

      measureText(argument);

      expect(canvasContextMock.measureText.withArgs('M').calledTwice).to.equal(true);
    });
  });
});
