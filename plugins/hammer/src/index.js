import Hammer from 'hammerjs';

const isTouchEvent = name => (
  /^tap|^swipe|^press|^rotate|^pinch|^pan/.test(name)
);

export default function initialize(picasso/* , options = {} */) {
  picasso.chart.mixin({
    mounted(element) {
      const touchEvents = [];
      Object.keys(this.on || {}).forEach((key) => {
        if (isTouchEvent(key)) {
          touchEvents.push(key);
        }
      });
      if (touchEvents.length) {
        const hammertime = new Hammer(element, {});

        hammertime.get('pinch').set({ enable: true });
        hammertime.get('rotate').set({ enable: true });

        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

        touchEvents.forEach((key) => {
          const fn = this.on[key];
          const listener = (e) => {
            fn.call(this, e);
          };
          hammertime.on(key, listener);
        });
        this.hammertime = hammertime;
      }
      this.touchEvents = touchEvents;
    },
    beforeDestroy() {
      if (this.hammertime) {
        this.touchEvents.forEach(key => this.hammertime.off(key));
        this.touchEvents = [];
        delete this.hammertime;
      }
    }
  });
}
