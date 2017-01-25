import EventEmitter from '../utils/event-emitter';

export default function scrollApi() {
  let min = 0;
  let max = 0;
  let start = 0;
  let viewSize = 0;
  start = start || min;

  const s = {
    move(value) {
      this.moveTo(start + value);
    },
    moveTo(value) {
      let newStart = Math.max(min, Math.min(max - viewSize, value));
      if (start !== newStart) {
        start = newStart;
        s.emit('update');
      }
    },
    update(settings) {
      ({ min = min, max = max, viewSize = viewSize } = settings);
      // update scroll to be within the new bounds
      this.moveTo(start);
    },
    getState() {
      return { min, max, start, viewSize };
    }
  };

  EventEmitter.mixin(s);

  return s;
}
