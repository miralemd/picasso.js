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
  const hyphenEnabled = node.hyphens === 'auto';
  const hyphensChar = {
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

  const newLine = () => {
    lines.push(line);
    lineWidth = 0;
    line = '';
  };

  const appendToLine = (token) => {
    lineWidth += token.width;
    line += token.value;
  };

  const insertHyphen = (token) => {
    if (!hyphenEnabled || !token.hyphenation || token.width > maxWidth) {
      return;
    }
    const peek = iterator.peek(token.index - 1);
    if (!peek.suppress) { // Suppressable char, remove it instead of inserting hyphen.
      line += hyphensChar.char;
    }
  };

  while (lines.length < maxLines) {
    const token = iterator.next();

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
        insertHyphen(token);
        newLine();
        appendToLine(token);
      }
    } else {
      appendToLine(token);
    }
  }

  return { lines, reduced };
}

const WORDBREAK = {
  'break-all': breakAll
};

export function lineBreak(items, measureText) {
  const getMeasureTextFn = node => (text => measureText({ text, fontSize: node.fontSize, fontFamily: node.fontFamily }));

  return items.map((item) => {
    if (item.type === 'text') {
      const wordBreakFn = WORDBREAK[item.wordBreak];
      if (!wordBreakFn) {
        return item;
      }

      const lineHeight = measureText(item).height * (item.lineHeight || 1.2);
      const container = {
        type: 'container',
        children: []
      };
      if (typeof item.id !== 'undefined') {
        container.id = item.id;
      }

      const result = wordBreakFn(item, getMeasureTextFn(item));
      let dy = 0;

      result.lines.forEach((line, i) => {
        const node = extend({}, item);
        node.text = line;
        if (result.reduced && i === result.lines.length - 1) {
          node.maxWidth = measureText({ // Ellipse last line
            text: line,
            fontSize: item.fontSize,
            fontFamily: item.fontFamily }).width - 1;
        } else {
          delete node.maxWidth;
        }
        node.dy = isNaN(node.dy) ? dy : node.dy + dy;
        dy += lineHeight;
        container.children.push(node);
      });
      return container;
    }
    return item;
  });
}
