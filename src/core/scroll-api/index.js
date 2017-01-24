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
      let newStart = Math.max(0, Math.min(max - min - viewSize, value));
      if (start !== newStart) {
        start = newStart;
        s.emit('update');
      }
    },
    update(settings) {
      ({ min, max, viewSize } = settings);
    },
    getState() {
      return { min, max, start, viewSize };
    }
  };

  EventEmitter.mixin(s);

  return s;
}
