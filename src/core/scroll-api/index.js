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
      let triggerUpdate = false;
      ({ min = min, max = max } = settings);
      if (settings.viewSize !== undefined && settings.viewSize !== viewSize) {
        viewSize = settings.viewSize;
        triggerUpdate = true;
      }

      // update scroll to be within the new bounds
      let newStart = Math.max(min, Math.min(max - viewSize, start));
      if (start !== newStart) {
        start = newStart;
        triggerUpdate = true;
      }

      if (triggerUpdate) {
        s.emit('update');
      }
    },
    getState() {
      return { min, max, start, viewSize };
    }
  };

  EventEmitter.mixin(s);

  return s;
}
