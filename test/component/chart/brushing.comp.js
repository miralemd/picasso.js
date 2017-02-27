/* eslint-disable no-unused-expressions */

import { chart } from '../../../src';
import createElement from '../../mocks/element-mock';

function simulateClick(elm, down, up = down) {
  elm.trigger('mousedown', {
    clientX: down.x,
    clientY: down.y,
    button: 0
  });
  elm.trigger('mouseup', {
    clientX: up.x,
    clientY: up.y,
    button: 0
  });
}

describe('Brushing', () => {
  let data;
  let settings;
  let pointMarker;
  let boxMarker;
  let discreteAxis;
  let brush;
  let element;

  describe('tap', () => {
    beforeEach(() => {
      element = createElement();

      data = [
        [
          ['Product', 'Cost'],
          ['Cars', 1],
          ['Trucks', 2]
        ]
      ];

      brush = {
        trigger: [
          {
            on: 'tap',
            contexts: ['test']
          }
        ],
        consume: [{
          context: 'test',
          style: {
            inactive: {
              fill: 'red'
            }
          }
        }]
      };

      pointMarker = {
        type: 'point-marker',
        data: {
          mapTo: {
            x: {
              source: '/0/0', reducer: 'first', type: 'qual'
            },
            y: {
              source: '/0/1'
            }
          },
          groupBy: {
            source: '/0/0',
            attribute: '$index'
          }
        },
        settings: {
          x: {
            scale: 'd0',
            ref: 'x'
          },
          y: {
            scale: 'm0',
            ref: 'y'
          }
        },
        brush
      };

      boxMarker = {
        type: 'box-marker',
        data: {
          mapTo: {
            min: { source: '/0/1' },
            start: { source: '/0/2' },
            med: { source: '/0/3' },
            end: { source: '/0/4' },
            max: { source: '/0/5' }
          },
          groupBy: {
            source: '/0/0'
          }
        },
        settings: {
          major: {
            scale: 'd0'
          },
          minor: {
            scale: 'mn'
          }
        },
        brush
      };

      discreteAxis = {
        type: 'axis',
        scale: 'd0',
        brush
      };

      settings = {
        scales: {
          d0: {
            source: '/0/0'
          },
          m0: {
            source: '/0/1',
            expand: 1 // Expand so that shapes dont end up at the boundaries
          }
        },
        components: []
      };
    });

    describe('thresholds', () => {
      it('should not tap if delta distance is greater the limit', () => {
        settings.components.push(pointMarker);

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const c = instance.findShapes('circle');
        // mousedown on first point and mouseup on second
        simulateClick(instance.element, {
          x: c[0].attrs.cx,
          y: c[0].attrs.cy
        }, {
          x: c[1].attrs.cx,
          y: c[1].attrs.cy
        });
        const activeShapes = instance.getAffectedShapes('test');

        expect(activeShapes).to.be.of.length(0);
      });
    });

    describe('propagation', () => {
      it('stop', () => {
        pointMarker.brush.trigger[0].propagation = 'stop';
        pointMarker.settings.x = undefined;
        settings.components.push(pointMarker);
        data = [
          [
            ['Product', 'Cost'],
            ['Cars', 1],
            ['Trucks', 1]
          ]
        ];

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const c1 = instance.findShapes('circle')[0];
        simulateClick(instance.element, {
          x: c1.attrs.cx,
          y: c1.attrs.cy
        });
        const activeShapes = instance.getAffectedShapes('test');
        const inactiveShapes = instance.findShapes('[fill="red"]');

        expect(activeShapes).to.be.of.length(1);
        expect(inactiveShapes).to.be.of.length(1);
        expect(activeShapes[0].attrs).to.deep.equal(c1.attrs);
      });

      it('data', () => {
        pointMarker.brush.trigger[0].propagation = 'data';
        pointMarker.settings.x = undefined;
        settings.components.push(pointMarker);
        data = [
          [
            ['Product', 'Cost'],
            ['Cars', 1], // overlap with Trucks
            ['Trucks', 1], // overlap with Cars
            ['Planes', 3]
          ]
        ];

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const c = instance.findShapes('circle');
        simulateClick(instance.element, {
          x: c[0].attrs.cx,
          y: c[0].attrs.cy
        });
        const activeShapes = instance.getAffectedShapes('test');
        const inactiveShapes = instance.findShapes('[fill="red"]');

        expect(activeShapes).to.be.of.length(2);
        expect(inactiveShapes).to.be.of.length(1);
        expect(activeShapes[0].attrs).to.deep.equal(c[0].attrs);
        expect(activeShapes[1].attrs).to.deep.equal(c[1].attrs);
      });
    });

    describe('components', () => {
      before(() => {
        // Axis require access to document to measure text
        global.document = {
          createElement
        };
      });

      after(() => {
        delete global.document;
      });

      it('point-marker', () => {
        settings.components.push(pointMarker);

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const c = instance.findShapes('circle');
        simulateClick(instance.element, {
          x: c[0].attrs.cx,
          y: c[0].attrs.cy
        });
        const activeShapes = instance.getAffectedShapes('test');
        const inactiveShapes = instance.findShapes('[fill="red"]');

        expect(activeShapes).to.be.of.length(1);
        expect(inactiveShapes).to.be.of.length(1);
        expect(activeShapes[0].attrs).to.deep.equal(c[0].attrs);
      });

      it('box-marker', () => {
        data = [
          [
            ['Product', 'm0', 'm1', 'm2', 'm3', 'm4'],
            ['Cars', 0.15, 0.3, 0.45, 0.5, 0.8],
            ['Trucks', 0.25, 0.3, 0.5, 0.7, 0.9],
            ['Planes', 0.1, 0.3, 0.6, 0.65, 0.69]
          ]
        ];
        settings.scales.mn = {
          source: ['/0/1', '/0/2', '/0/3', '/0/4', '/0/5'],
          expand: 0.1
        };
        settings.components.push(boxMarker);

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const rects = instance.findShapes('rect');
        simulateClick(instance.element, {
          x: rects[0].attrs.x + (rects[0].attrs.width / 2),
          y: rects[0].attrs.y + (rects[0].attrs.height / 2)
        });
        const activeShapes = instance.getAffectedShapes('test');
        const inactiveShapes = instance.findShapes('rect[fill="red"]');
        const activeRects = activeShapes.filter(s => s.type === 'rect');

        expect(activeRects).to.be.of.length(1);
        expect(inactiveShapes).to.be.of.length(2);
        expect(activeRects[0].attrs).to.deep.equal(rects[0].attrs);
      });

      it('axis', () => {
        settings.components.push(discreteAxis);

        const instance = chart({
          element,
          data: { data },
          settings
        });

        const texts = instance.findShapes('text');
        simulateClick(instance.element, {
          x: texts[0].bounds.x + (texts[0].bounds.width / 2),
          y: texts[0].bounds.y + (texts[0].bounds.height / 2)
        });
        const activeShapes = instance.getAffectedShapes('test');
        const inactiveShapes = instance.findShapes('[fill="red"]');

        expect(activeShapes).to.be.of.length(1);
        expect(inactiveShapes).to.be.of.length(1);
        expect(activeShapes[0].attrs).to.deep.equal(texts[0].attrs);
      });
    });
  });
});
