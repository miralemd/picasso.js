import { ellipsText, breakAll } from '../../../../src/web/renderer/text-manipulation';

describe('Text Manipulation', () => {
  describe('ellips text', () => {
    const measureTextMock = ({ text }) => ({ width: text.length, height: 1 });
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

  describe('breakAll', () => {
    const measureTextMock = text => ({ width: text.length, height: 1 });
    let node;
    beforeEach(() => {
      node = {
        type: 'text',
        text: '123456789'
      };
    });

    describe('maxLines', () => {
      it('should respect maxLines and indicate if a subset is returned', () => {
        node.maxWidth = 1;
        node.maxLines = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1', '2', '3'],
          reduced: true
        });
      });

      it('should have a lower boundary clamp maxLines of 1', () => {
        node.maxWidth = 1;
        node.maxLines = -1;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1'],
          reduced: true
        });
      });

      it('should line-break full text if maxLines is not set', () => {
        node.maxWidth = 1;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: node.text.split(''),
          reduced: false
        });
      });
    });

    describe('maxWidth', () => {
      it('should handle if maxWidth is undefined', () => {
        node.maxLines = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['123456789'],
          reduced: false
        });
      });

      it('should handle if maxWidth is zero or less', () => {
        node.maxWidth = 0;
        node.maxLines = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1', '2', '3'],
          reduced: true
        });
      });

      it('should continue line-break if a single char is wider then maxWidth', () => {
        node.text = 'ASDFGHJKLÖÄ';
        node.maxWidth = 3;
        let chunks = breakAll(node, text => ({ width: text === 'G' ? 4 : 1, height: 1 }));
        expect(chunks).to.deep.equal({
          lines: ['ASD', 'F', 'G', 'HJK', 'LÖÄ'],
          reduced: false
        });
      });
    });

    describe('Break opportunities', () => {
      it('should respect mandatory break opportunities in text', () => {
        node.text = '123\n\n\n45\n6789';
        node.maxWidth = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['123', '', '', '45', '678', '9'],
          reduced: false
        });
      });

      it('should include mandatory break opportunities in maxLines check', () => {
        node.text = '123\n\n\n45\n6789';
        node.maxWidth = 3;
        node.maxLines = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['123', '', ''],
          reduced: true
        });
      });
    });

    describe('Hyphenation', () => {
      it('should inject hyphens', () => {
        node.text = 'ASDFGHJKLÖÄ';
        node.maxWidth = 3;
        node.hyphens = 'auto';
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['ASD-', 'FGH-', 'JKL-', 'ÖÄ'],
          reduced: false
        });
      });

      it('should not inject hyphens if line-break occur at a suppressable character', () => {
        node.text = 'ASD FGHJKLÖÄ'; // White-space is suppressable
        node.maxWidth = 3;
        node.hyphens = 'auto';
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['ASD', 'FGH-', 'JKL-', 'ÖÄ'],
          reduced: false
        });
      });
    });

    describe('Suppress characters', () => {
      it('should suppress visisble word separator', () => {
        // http://www.unicode.org/reports/tr14/tr14-37.html#WordSeparators
        // 2 is followed by 2 spaces, 3 is followed by 5 spaces
        node.text = '1 2  3     4 5 6 7 8 9';
        node.maxWidth = 3;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1 2', '3  ', '4 5', '6 7', '8 9'],
          reduced: false
        });
      });
    });
  });
});
