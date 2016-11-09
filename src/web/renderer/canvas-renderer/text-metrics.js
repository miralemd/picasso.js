let heightMeasureCache = {},
  widthMeasureCache = {},
  canvasCache;

function measureTextWidth({ text, fontSize, fontFamily }) {
  const match = widthMeasureCache[text + fontSize + fontFamily];
  if (match !== undefined) {
    return match;
  } else {
    canvasCache = canvasCache ? canvasCache : document.createElement('canvas');
    const g = canvasCache.getContext('2d');
    g.font = `${fontSize} ${fontFamily}`;
    const w = g.measureText(text).width;
    widthMeasureCache[text + fontSize + fontFamily] = w;
    return w;
  }
}

function measureTextHeight({ fontSize, fontFamily }) {
  const match = heightMeasureCache[fontSize + fontFamily];

  if (match !== undefined) {
    return match;
  } else {
    const text = 'M';
    const height = measureTextWidth({ text, fontSize, fontFamily }) * 1.2;
    heightMeasureCache[fontSize + fontFamily] = height;
    return height;
  }
}

export function measureText({ text, fontSize, fontFamily }) {
  const w = measureTextWidth({ text, fontSize, fontFamily });
  const h = measureTextHeight({ fontSize, fontFamily });
  return { width: w, height: h };
}
