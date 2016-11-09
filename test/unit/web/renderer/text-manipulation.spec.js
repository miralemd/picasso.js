import { ellipsText } from '../../../../src/web/renderer/text-manipulation';

describe('Text Manipulation', () => {
  describe('ellips text', () => {
    const measureTextMock = ({ text }) =>
       ({ width: text.length })
    ;

    let textNode;

    beforeEach(() => {
      textNode = { text: 'test', 'font-size': 13, 'font-family': 'Arial', maxWidth: 5 };
    });

    it('should ellips text until it is below max width', () => {
      textNode.text = '123456789';
      const text = ellipsText(textNode, measureTextMock);
      expect(text).to.equal('1234…');
    });

    it('should not ellips text if it already is below max width', () => {
      textNode.text = '12345';
      const text = ellipsText(textNode, measureTextMock);
      expect(text).to.equal('12345');
    });

    it('should never return an empty string', () => {
      textNode.text = '123456789';
      textNode.maxWidth = 0;
      const text = ellipsText(textNode, measureTextMock);
      expect(text).to.equal('…');
    });

    it('should handle if max width is negative', () => {
      textNode.text = '123456789';
      textNode.maxWidth = -5;
      const text = ellipsText(textNode, measureTextMock);
      expect(text).to.equal('…');
    });

    it('should handle if max width is undefined', () => {
      textNode.text = '123456789';
      textNode.maxWidth = undefined;
      const text = ellipsText(textNode, measureTextMock);
      expect(text).to.equal('123456789');
    });

    it('should not modify text node', () => {
      textNode.text = '123456789';
      textNode.maxWidth = 5;
      ellipsText(textNode, measureTextMock);
      expect(textNode.text).to.equal('123456789');
    });
  });
});
