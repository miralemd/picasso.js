

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
