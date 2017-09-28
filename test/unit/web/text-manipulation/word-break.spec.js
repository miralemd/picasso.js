import breakAll from '../../../../src/web/text-manipulation/word-break';

describe('Word Break', () => {
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

    describe('maxHeight', () => {
      it('should respect maxHeight and indicate if a subset is returned', () => {
        node.maxWidth = 1;
        node.maxHeight = 3;
        node.lineHeight = 1; // Line height attribute is used in the line height calcucation thus affecting the number of lines allowed
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1', '2', '3'],
          reduced: true
        });
      });

      it('should handle NaN values', () => {
        node.maxWidth = 1;
        node.maxHeight = NaN;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: node.text.split(''),
          reduced: false
        });
      });

      it('should use the lowest value of maxHeight and maxLines', () => {
        node.maxWidth = 1;
        node.maxLines = 3;
        node.maxHeight = 2;
        node.lineHeight = 1;
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['1', '2'],
          reduced: true
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
          lines: ['AS-', 'DF-', 'GH-', 'JK-', 'LÖÄ'],
          reduced: false
        });
      });

      it('should not inject hyphens if there isnt a pairwise match', () => {
        node.text = 'AS DF次GH1JKLÖÄ'; // White-space, CJK char and number doesn't support hyphens
        node.maxWidth = 3;
        node.hyphens = 'auto';
        const chunks = breakAll(node, measureTextMock);
        expect(chunks).to.deep.equal({
          lines: ['AS ', 'DF次', 'GH1', 'JK-', 'LÖÄ'],
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
