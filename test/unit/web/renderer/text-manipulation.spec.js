import {
  ellipsText,
  breakAll,
  onLineBreak
} from '../../../../src/web/renderer/text-manipulation';

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

  describe('onLineBreak', () => {
    const measureTextMock = ({ text }) => ({ width: text.length, height: 1 });
    let measureTextSpy;
    let node;
    let state;
    let fn;

    beforeEach(() => {
      node = { type: 'text' };
      state = { node };
      measureTextSpy = sinon.spy();
      fn = onLineBreak(measureTextMock);
    });

    it('should only be invoked on text nodes', () => {
      node.wordBreak = 'break-all';
      node.type = 'container';
      fn = onLineBreak(measureTextSpy);
      fn(state);
      expect(measureTextSpy).to.not.have.been.called;
    });

    it('should not be invoked on text nodes if wordBreak property is missing', () => {
      fn = onLineBreak(measureTextSpy);
      fn(state);
      expect(measureTextSpy).to.not.have.been.called;
    });

    it('should not be invoked on text node if tagged as a multi-line node', () => {
      node.wordBreak = 'break-all';
      node._lineBreak = true; // _lineBreak prop how it's internally tagged if part o multi-line text
      fn = onLineBreak(measureTextSpy);
      fn(state);
      expect(measureTextSpy).to.not.have.been.called;
    });

    it('should tag output nodes', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.maxWidth = 3;
      fn(state);
      expect(state.node.type).to.equal('container');
      state.node.children.forEach((c) => {
        expect(c._lineBreak).to.be.true;
      });
    });

    it('should inherit id attribute from text node', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.maxWidth = 3;
      node.id = 'test';
      fn(state);
      expect(state.node.type).to.equal('container');
      expect(state.node.id).to.equal('test');
    });

    it('should respect lineHeight attribute', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.x = 0;
      node.y = 0;
      node.maxWidth = 3;
      node.lineHeight = 10;
      fn(state);
      expect(state.node.children[0].dy).to.equal(0);
      expect(state.node.children[1].dy).to.equal(10);
      expect(state.node.children[2].dy).to.equal(20);
    });

    it('should include dy attribute when calculating position', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.x = 0;
      node.y = 0;
      node.dy = 3;
      node.maxWidth = 3;
      node.lineHeight = 10;
      fn(state);
      expect(state.node.children[0].dy).to.equal(3);
      expect(state.node.children[1].dy).to.equal(13);
      expect(state.node.children[2].dy).to.equal(23);
    });

    it('should remove maxWidth attribute', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.x = 0;
      node.y = 0;
      node.maxWidth = 3;
      node.maxLines = 2;
      fn(state);
      expect(state.node.children[0].maxWidth).to.equal(undefined);
      expect(state.node.children[1].maxWidth).to.equal(2); // Text width minus 1 for last line if reduced
    });

    it('should not line-break node if text fits on a single line', () => {
      node.text = '123456789';
      node.wordBreak = 'break-all';
      node.maxWidth = 9;
      node.maxLines = 2;
      fn(state);
      expect(state.node).to.deep.equal(node);
    });
  });
});
