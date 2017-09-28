import stringTokenizer from './string-tokenizer';
import {
  DEFAULT_LINE_HEIGHT,
  HYPHENS_CHAR
} from './text-const';

function resolveMaxAllowedLines(node, measuredLineHeight) {
  const maxHeight = node.maxHeight;
  let maxLines = Math.max(node.maxLines, 1) || Infinity;

  if (isNaN(maxHeight)) {
    return maxLines;
  }

  const lineHeight = node.lineHeight || DEFAULT_LINE_HEIGHT;
  const calcLineHeight = measuredLineHeight * lineHeight;

  return Math.max(1, Math.min(Math.floor(maxHeight / calcLineHeight), maxLines));
}

export default function breakAll(node, measureText) {
  const text = node.text;
  const hyphens = {
    enabled: node.hyphens === 'auto',
    char: HYPHENS_CHAR,
    metrics: measureText(HYPHENS_CHAR)
  };
  const iterator = stringTokenizer({
    string: text,
    seperator: '',
    measureText,
    noBreakAllowedIdentifiers: [(chunk, i) => i === 0]
  });
  const lines = [];
  const maxWidth = node.maxWidth;
  const maxLines = resolveMaxAllowedLines(node, measureText(node.text).height);
  let lineWidth = 0;
  let line = '';
  let reduced = true;

  function newLine() {
    lines.push(line);
    lineWidth = 0;
    line = '';
  }

  function appendToLine(token) {
    lineWidth += token.width;
    line += token.value;
  }

  function insertHyphenAndJump(token) {
    if (token.width > maxWidth) {
      return token;
    }

    const startIndex = token.index;

    for (let i = 1; i < 5; i++) {
      const pairToken = iterator.peek(token.index - 1);
      if (!token.hyphenation || !pairToken.hyphenation) {
        return token;
      }

      if (lineWidth + hyphens.metrics.width <= maxWidth) {
        line += hyphens.char;
        return token;
      }

      token = iterator.next(startIndex - i);
      line = line.slice(0, -1);
      lineWidth -= token.width;
    }

    return token;
  }

  while (lines.length < maxLines) {
    let token = iterator.next();

    if (token.done) {
      newLine();
      reduced = false;
      break;
    }

    if (token.breakOpportunity === 'mandatory') {
      newLine();
    } else if (lineWidth + token.width > maxWidth && token.breakOpportunity === 'breakAllowed') {
      if (token.suppress) { // Token is suppressable and can be ignored
        lineWidth += token.width;
      } else {
        token = hyphens.enabled ? insertHyphenAndJump(token) : token;
        newLine();
        appendToLine(token);
      }
    } else {
      appendToLine(token);
    }
  }

  return { lines, reduced };
}
