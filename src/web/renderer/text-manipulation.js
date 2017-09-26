import extend from 'extend';
import stringTokenizer from './string-tokenizer';

export function ellipsText({ text, 'font-size': fontSize, 'font-family': fontFamily, maxWidth }, measureText) { // eslint-disable-line import/prefer-default-export
  const reduceChars = '…';
  text = typeof text === 'string' ? text : text.toString();
  if (maxWidth === undefined) {
    return text;
  }
  let textWidth = measureText({ text, fontSize, fontFamily }).width;
  if (textWidth <= maxWidth) {
    return text;
  }

  let min = 0;
  let max = text.length - 1;
  while (min <= max) {
    let reduceIndex = Math.floor((min + max) / 2);
    let reduceText = text.substr(0, reduceIndex) + reduceChars;
    textWidth = measureText({ text: reduceText, fontSize, fontFamily }).width;
    if (textWidth <= maxWidth) {
      min = reduceIndex + 1;
    } else { // textWidth > maxWidth
      max = reduceIndex - 1;
    }
  }
  return text.substr(0, max) + reduceChars;
}

export function breakAll(node, measureText) {
  const text = node.text;
  const hyphens = {
    enabled: node.hyphens === 'auto',
    char: '-',
    metrics: measureText('-')
  };
  const iterator = stringTokenizer({
    string: text,
    seperator: '',
    measureText,
    noBreakAllowedIdentifiers: [(chunk, i) => i === 0]
  });
  const lines = [];
  const maxWidth = node.maxWidth;
  const maxLines = Math.max(node.maxLines, 1) || Infinity;
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

export function resolveLineBreakAlgorithm(node) {
  const WORDBREAK = {
    'break-all': breakAll
  };

  return WORDBREAK[node.wordBreak];
}


/**
 * Apply wordBreak rules to text nodes.
 * @param {function} measureText
 * @returns {function} Event function to convert a text node into multiple nodes
 */
export function onLineBreak(measureText) {
  function generateLineNodes(result, item, lineHeight) {
    const container = { type: 'container', children: [] };

    if (typeof item.id !== 'undefined') { // TODO also inherit data attribute and more?
      container.id = item.id;
    }

    let currentY = 0;

    result.lines.forEach((line, i) => {
      const node = extend({}, item);
      node.text = line;
      node._lineBreak = true; // Flag node as processed to avoid duplicate linebreak run

      if (result.reduced && i === result.lines.length - 1) {
        node.maxWidth = measureText({ // Ellipse last line
          text: line,
          fontSize: item.fontSize,
          fontFamily: item.fontFamily }).width - 1;
      } else {
        delete node.maxWidth;
      }
      node.dy = isNaN(node.dy) ? currentY : node.dy + currentY;
      currentY += lineHeight;
      container.children.push(node);
    });

    return container;
  }

  function shouldLineBreak(item) {
    // If type text and not already broken into lines
    return item.type === 'text' && !item._lineBreak;
  }

  function wrappedMeasureText(node) {
    return text => measureText({
      text,
      fontSize: node.fontSize,
      fontFamily: node.fontFamily
    });
  }

  return (state) => {
    const item = state.node;
    if (shouldLineBreak(item)) {
      const wordBreakFn = resolveLineBreakAlgorithm(item);
      if (!wordBreakFn) {
        return;
      }

      const tm = measureText(item);
      if (tm.width <= item.maxWidth) {
        return;
      }

      const lineHeight = tm.height * (item.lineHeight || 1.2);
      const result = wordBreakFn(item, wrappedMeasureText(item));

      state.node = generateLineNodes(result, item, lineHeight); // Convert node to container
    }
  };
}
