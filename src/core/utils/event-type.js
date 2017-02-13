export function detectPointerSupport(e) {
  if ('onpointerdown' in e) {
    return true;
  }
  return false;
}

export function detectTouchSupport(e) {
  if ('ontouchstart' in e) {
    return true;
  }
  return false;
}
