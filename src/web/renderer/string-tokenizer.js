function includesLineBreak(c) {
  return c.search(/\n+|\r+|\r\n/) !== -1;
}

function includesWhiteSpace(c) {
  return c.search(/\s/) !== -1;
}

function hyphenationAllowed(c) {
  /* Latin character set. Excluding numbers, sign and symbol characters, but including soft hyphen */
  return c.search(/[a-zA-Z\u00C0-\u00F6\u00F8-\u00FF\u00AD]/) !== -1;
}

function resolveBreakOpportunity(chunk, i, chunks, mandatory, noBreakAllowed) {
  if (mandatory.some(check => check(chunk, i, chunks))) {
    return 'mandatory';
  }
  if (noBreakAllowed.some(check => check(chunk, i, chunks))) {
    return 'noBreak';
  }

  return 'breakAllowed';
}

export default function stringTokenizer({
  string,
  separator = '',
  reverse = false,
  measureText = text => ({ width: text.length, height: 1 }),
  mandatoryBreakIdentifiers = [includesLineBreak],
  noBreakAllowedIdentifiers = [],
  suppressIdentifier = [includesWhiteSpace, includesLineBreak],
  hyphenationIdentifiers = [hyphenationAllowed]
} = {}) {
  const chunks = String(string).split(separator);
  let index = reverse ? chunks.length - 1 : 0;
  const condition = reverse ? () => index >= 0 : () => index < chunks.length;
  const clamp = val => Math.max(0, Math.min(chunks.length - 1, val));

  const peek = (target) => {
    const i = clamp(target);
    const chunk = chunks[i];
    const textMeasure = measureText(chunk);
    const opportunity = resolveBreakOpportunity(
      chunk,
      i,
      chunks,
      mandatoryBreakIdentifiers,
      noBreakAllowedIdentifiers
    );

    return {
      index: i,
      value: chunk,
      breakOpportunity: opportunity,
      suppress: suppressIdentifier.some(check => check(chunk, i, chunks)),
      hyphenation: hyphenationIdentifiers.some(check => check(chunk, i, chunks)),
      width: textMeasure.width,
      height: textMeasure.height,
      done: false
    };
  };

  return {
    next: (jump) => {
      if (condition()) {
        let i;
        if (isNaN(jump)) {
          i = reverse ? index-- : index++;
        } else {
          index = clamp(jump);
          i = index;
        }
        return peek(i);
      }
      return { done: true };
    },
    peek,
    done: () => !condition(),
    length: chunks.length
  };
}
