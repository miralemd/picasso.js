import stringTokenizer from '../../../../src/web/renderer/string-tokenizer';

function toArray(tokens) {
  const ary = [];
  while (!tokens.done()) {
    ary.push(tokens.next());
  }
  return ary;
}

describe('String Tokenizer', () => {
  let tokens;

  it('should tokenize input string', () => {
    tokens = stringTokenizer({
      string: 'le',
      separator: ''
    });
    const ary = toArray(tokens);
    expect(ary).to.deep.equal([
      {
        index: 0,
        value: 'l',
        breakOpportunity: 'breakAllowed',
        suppress: false,
        hyphenation: true,
        width: 1,
        height: 1,
        done: false
      },
      {
        index: 1,
        value: 'e',
        breakOpportunity: 'breakAllowed',
        suppress: false,
        hyphenation: true,
        width: 1,
        height: 1,
        done: false
      }
    ]);
  });

  describe('Error handling', () => {
    it('should handle non-string types', () => {
      tokens = stringTokenizer({ string: null });
      const ary = toArray(tokens).map(t => t.value);
      expect(ary).to.deep.equal(['n', 'u', 'l', 'l']);
    });

    it('should handle no arguments', () => {
      tokens = stringTokenizer();
      const ary = toArray(tokens).map(t => t.value);
      expect(ary).to.deep.equal('undefined'.split(''));
    });
  });

  describe('Parameters', () => {
    it('should accept a string as seperator', () => {
      tokens = stringTokenizer({ string: 'H,e,j', separator: ',' });
      const ary = toArray(tokens).map(t => t.value);
      expect(ary).to.deep.equal(['H', 'e', 'j']);
    });

    it('should accept a regex as seperator', () => {
      tokens = stringTokenizer({ string: 'H,e,j', separator: /,/ });
      const ary = toArray(tokens).map(t => t.value);
      expect(ary).to.deep.equal(['H', 'e', 'j']);
    });

    it('should iterator from end to start of string', () => {
      tokens = stringTokenizer({ string: 'Hej', reverse: true });
      const ary = toArray(tokens).map(t => t.value);
      expect(ary).to.deep.equal(['j', 'e', 'H']);
    });

    it('should trigger mandatory break opportunity if mandatory break identifier resolves to true', () => {
      tokens = stringTokenizer({
        string: 'Hej',
        mandatoryBreakIdentifiers: [chunk => chunk === 'e', () => false]
      });
      const ary = toArray(tokens).map(t => t.breakOpportunity);
      expect(ary).to.deep.equal(['breakAllowed', 'mandatory', 'breakAllowed']);
    });

    it('should trigger noBreak opportunity if any noBreak identifier resolves to true', () => {
      tokens = stringTokenizer({
        string: 'Hej',
        noBreakAllowedIdentifiers: [chunk => chunk === 'e', () => false]
      });
      const ary = toArray(tokens).map(t => t.breakOpportunity);
      expect(ary).to.deep.equal(['breakAllowed', 'noBreak', 'breakAllowed']);
    });

    it('should not trigger noBreak opportunity if mandatory identifier resolves to true', () => {
      tokens = stringTokenizer({
        string: 'Hej',
        mandatoryBreakIdentifiers: [() => true],
        noBreakAllowedIdentifiers: [() => true]
      });
      const ary = toArray(tokens).map(t => t.breakOpportunity);
      expect(ary).to.deep.equal(['mandatory', 'mandatory', 'mandatory']);
    });

    it('should trigger suppress flag if any suppress identifier resolves to true', () => {
      tokens = stringTokenizer({
        string: 'Hej',
        suppressIdentifier: [chunk => chunk === 'e', () => false]
      });
      const ary = toArray(tokens).map(t => t.suppress);
      expect(ary).to.deep.equal([false, true, false]);
    });

    it('should accept a custom text metrics function', () => {
      tokens = stringTokenizer({
        string: 'Hej',
        measureText: () => ({ width: 11, height: 22 })
      });
      const ary = toArray(tokens);
      const widths = ary.map(t => t.width);
      expect(widths).to.deep.equal([11, 11, 11]);
      const heights = ary.map(t => t.height);
      expect(heights).to.deep.equal([22, 22, 22]);
    });
  });
});
