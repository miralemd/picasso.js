import { measureText } from '../../text-metrics';
import { ellipsText } from '../../text-manipulation';
import { detectTextDirection, flipTextAnchor } from '../../../../core/utils/rtl-util';

function convertBaseline(baseline) {
  if (baseline === 'central') {
    return 'middle';
  } else if (baseline === 'text-before-edge') {
    return 'top';
  } else if (baseline === 'text-after-edge') {
    return 'bottom';
  }

  return baseline;
}

export default function render(t, { g }) {
  const text = ellipsText(t, measureText);

  g.font = `${t['font-size']} ${t['font-family']}`;
  g.canvas.dir = detectTextDirection(t.text);
  let textAlign = t['text-anchor'] === 'middle' ? 'center' : t['text-anchor'];
  g.textAlign = flipTextAnchor(textAlign, g.canvas.dir);
  g.textBaseline = convertBaseline(t['dominant-baseline']);
  g.fillText(text, t.x + t.dx, t.y + t.dy);
}
