import { buildTick, buildLabel, buildLine } from '../../../../../src/core/chart-components/axis/axis-structs';

describe('AxisStructs', () => {
  const innerRect = { x: 0, y: 0, width: 0, height: 0 };
  const outerRect = { x: 0, y: 0, width: 0, height: 0 };
  const textRect = { width: 10, height: 10 };

  beforeEach(() => {
    innerRect.width = 50;
    innerRect.height = 100;
    innerRect.x = 0;
    innerRect.y = 0;
    outerRect.width = 50;
    outerRect.height = 100;
    outerRect.x = 0;
    outerRect.y = 0;
  });

  describe('Tick', () => {
    let buildOpts,
      tick,
      expected;

    beforeEach(() => {
      buildOpts = {
        style: { strokeWidth: 1, stroke: 'red' },
        tickSize: 5,
        align: 'bottom',
        padding: 10,
        innerRect,
        outerRect
      };
      tick = { position: 0.5 };
      expected = {
        type: 'line',
        strokeWidth: 1,
        stroke: 'red',
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0 };
    });

    describe('Left align', () => {
      beforeEach(() => {
        buildOpts.align = 'left';
        expected.x1 = innerRect.width - buildOpts.padding;
        expected.x2 = innerRect.width - buildOpts.padding - buildOpts.tickSize;
      });

      it('middle tick', () => {
        expected.y1 = 50;
        expected.y2 = 50;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start tick', () => {
        tick.position = 0;
        expected.y1 = 0.5;
        expected.y2 = 0.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end tick', () => {
        tick.position = 1;
        expected.y1 = 99.5;
        expected.y2 = 99.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Right align', () => {
      beforeEach(() => {
        buildOpts.align = 'right';
        expected.x1 = buildOpts.padding;
        expected.x2 = buildOpts.padding + buildOpts.tickSize;
      });

      it('middle tick', () => {
        expected.y1 = 50;
        expected.y2 = 50;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start tick', () => {
        tick.position = 0;
        expected.y1 = 0.5;
        expected.y2 = 0.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end tick', () => {
        tick.position = 1;
        expected.y1 = 99.5;
        expected.y2 = 99.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Top align', () => {
      beforeEach(() => {
        buildOpts.align = 'top';
        expected.y1 = innerRect.height - buildOpts.padding;
        expected.y2 = innerRect.height - buildOpts.padding - buildOpts.tickSize;
      });

      it('middle tick', () => {
        expected.x1 = 25;
        expected.x2 = 25;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start tick', () => {
        tick.position = 0;
        expected.x1 = 0.5;
        expected.x2 = 0.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end tick', () => {
        tick.position = 1;
        expected.x1 = 49.5;
        expected.x2 = 49.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Bottom align', () => {
      beforeEach(() => {
        buildOpts.align = 'bottom';
        expected.y1 = buildOpts.padding;
        expected.y2 = buildOpts.padding + buildOpts.tickSize;
      });

      it('middle tick', () => {
        expected.x1 = 25;
        expected.x2 = 25;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start tick', () => {
        tick.position = 0;
        expected.x1 = 0.5;
        expected.x2 = 0.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end tick', () => {
        tick.position = 1;
        expected.x1 = 49.5;
        expected.x2 = 49.5;
        expect(buildTick(tick, buildOpts)).to.deep.equal(expected);
      });
    });
  });

  describe('Label', () => {
    let buildOpts,
      tick,
      expected;

    beforeEach(() => {
      buildOpts = {
        style: { fontFamily: 'Arial', fill: 'red', fontSize: 10 },
        align: 'bottom',
        padding: 10,
        innerRect,
        outerRect,
        maxWidth: textRect.width,
        maxHeight: textRect.height,
        textRect
      };
      tick = { position: 0.5, label: '50%' };
      expected = {
        type: 'text',
        text: '50%',
        x: 0,
        y: 0,
        fill: 'red',
        fontFamily: 'Arial',
        fontSize: 10,
        anchor: 'end',
        maxWidth: textRect.width,
        maxHeight: textRect.height
      };
    });

    describe('Left align', () => {
      beforeEach(() => {
        buildOpts.align = 'left';
        expected.x = innerRect.width - buildOpts.padding;
        expected.dy = textRect.height / 3;
        // expected.baseline = 'central';
      });

      it('middle label', () => {
        expected.y = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.y = 100;
        expected.dy = 0;
     //   expected.baseline = 'text-after-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label with margin', () => {
        outerRect.height = 105;
        tick.position = 1;
        expected.y = 100;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.y = 0;
        expected.dy = 10;
      //  expected.baseline = 'text-before-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label with margin', () => {
        innerRect.y = 5;
        tick.position = 0;
        expected.y = 5;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Right align', () => {
      beforeEach(() => {
        buildOpts.align = 'right';
        expected.x = 10;
        expected.dy = textRect.height / 3;
        expected.anchor = 'start';
       // expected.baseline = 'central';
      });

      it('middle label', () => {
        expected.y = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.y = 100;
        expected.dy = 0;
      //  expected.baseline = 'text-after-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label with margin', () => {
        outerRect.height = 105;
        tick.position = 1;
        expected.y = 100;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.y = 0;
        expected.dy = 10;
       // expected.baseline = 'text-before-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label with margin', () => {
        innerRect.y = 5;
        tick.position = 0;
        expected.y = 5;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Top align', () => {
      beforeEach(() => {
        buildOpts.align = 'top';
        expected.y = innerRect.height - buildOpts.padding;
        expected.anchor = 'middle';
      });

      it('middle label', () => {
        expected.x = 25;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.x = 0;
        expected.anchor = 'left';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label with margin', () => {
        tick.position = 0;
        innerRect.x = 5;
        expected.x = 5;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.x = 50;
        expected.anchor = 'end';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label with margin', () => {
        tick.position = 1;
        outerRect.width = 65;
        expected.x = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Bottom align', () => {
      beforeEach(() => {
        buildOpts.align = 'bottom';
        expected.y = 20;
        expected.anchor = 'middle';
      });

      it('middle label', () => {
        expected.x = 25;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.x = 0;
        expected.anchor = 'left';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('start label with margin', () => {
        tick.position = 0;
        innerRect.x = 5;
        expected.x = 5;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.x = 50;
        expected.anchor = 'end';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });

      it('end label with margin', () => {
        tick.position = 1;
        outerRect.width = 65;
        expected.x = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
      });
    });

    describe('Tilted', () => {
      const rad45 = -45 * (Math.PI / 180);
      const rad60 = -60 * (Math.PI / 180);
      beforeEach(() => {
        buildOpts.tilted = true;
        buildOpts.angle = 45;
        expected.y = 10 + ((buildOpts.maxHeight * Math.cos(rad45)) / 2); // 10 is top of rect + padding
        expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad45)) / 2); // 25 is in the middle: width * tick.position
        expected.transform = `rotate(-45, ${expected.x}, ${expected.y})`;
        tick = { position: 0.5, label: 'mmmmmm' };
        expected.text = tick.label;
      });
      describe('align bottom', () => {
        beforeEach(() => {
          buildOpts.align = 'bottom';
          expected.anchor = 'end';
        });
        it('45deg', () => {
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
        it('60deg', () => {
          expected.y = 10 + ((buildOpts.maxHeight * Math.cos(rad60)) / 2);
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad60)) / 2);
          expected.transform = `rotate(-60, ${expected.x}, ${expected.y})`;
          buildOpts.angle = 60;
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
        it('-45deg', () => {
          expected.y = 10 + ((buildOpts.maxHeight * Math.cos(-rad45)) / 2);
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(-rad45)) / 2);
          expected.transform = `rotate(45, ${expected.x}, ${expected.y})`;
          expected.anchor = 'start';
          buildOpts.angle = -45;
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
      });
      describe('align top', () => {
        beforeEach(() => {
          buildOpts.align = 'top';
          expected.anchor = 'start';
        });
        it('45deg', () => {
          buildOpts.angle = 45;
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad45)) / 3);
          expected.y = 90; // Bottom of the rect - padding
          expected.transform = `rotate(-45, ${expected.x}, 90)`;
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
        it('60deg', () => {
          buildOpts.angle = 60;
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad60)) / 3);
          expected.y = 90;
          expected.transform = `rotate(-60, ${expected.x}, ${expected.y})`;
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
        it('-45deg', () => {
          buildOpts.angle = -45;
          expected.anchor = 'end';
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(-rad45)) / 3);
          expected.y = 90; // Bottom of the rect - padding
          expected.transform = `rotate(45, ${expected.x}, 90)`;
          expect(buildLabel(tick, buildOpts)).to.deep.equal(expected);
        });
      });
    });

    describe('Collider', () => {
      it('should not have a collider if stepSize is undefined', () => {
        buildOpts.stepSize = undefined;
        const label = buildLabel(tick, buildOpts);

        expect(label.collider).to.equal(undefined);
      });

      it('should not have a collider if layered', () => {
        buildOpts.stepSize = 0.2;
        buildOpts.layered = true;
        const label = buildLabel(tick, buildOpts);

        expect(label.collider).to.equal(undefined);
      });

      it('should not have a collider if titled', () => {
        buildOpts.stepSize = 0.2;
        buildOpts.tilted = true;
        const label = buildLabel(tick, buildOpts);

        expect(label.collider).to.equal(undefined);
      });

      describe('align left', () => {
        beforeEach(() => {
          buildOpts.align = 'left';
        });

        it('should have a collider', () => {
          buildOpts.stepSize = 0.2;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 49.9,
            width: buildOpts.innerRect.width,
            height: buildOpts.stepSize
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the bottom boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 0;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 0,
            width: buildOpts.innerRect.width,
            height: buildOpts.stepSize / 2
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the top boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 1;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 99.9,
            width: buildOpts.innerRect.width,
            height: 0.09999999999999148
          };

          expect(label.collider).to.deep.equal(expected);
        });
      });

      describe('align right', () => {
        beforeEach(() => {
          buildOpts.align = 'right';
        });

        it('should have a collider', () => {
          buildOpts.stepSize = 0.2;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 49.9,
            width: buildOpts.innerRect.width,
            height: buildOpts.stepSize
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the bottom boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 0;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 0,
            width: buildOpts.innerRect.width,
            height: buildOpts.stepSize / 2
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the top boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 1;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 99.9,
            width: buildOpts.innerRect.width,
            height: 0.09999999999999148
          };

          expect(label.collider).to.deep.equal(expected);
        });
      });

      describe('align top', () => {
        beforeEach(() => {
          buildOpts.align = 'top';
        });

        it('should have a collider', () => {
          buildOpts.stepSize = 0.2;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 24.9,
            y: 0,
            width: buildOpts.stepSize,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the bottom boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 0;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 0,
            width: buildOpts.stepSize / 2,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the top boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 1;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 49.9,
            y: 0,
            width: 0.09999999999999859,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });
      });

      describe('align bottom', () => {
        beforeEach(() => {
          buildOpts.align = 'bottom';
        });

        it('should have a collider', () => {
          buildOpts.stepSize = 0.2;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 24.9,
            y: 0,
            width: buildOpts.stepSize,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the bottom boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 0;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 0,
            y: 0,
            width: buildOpts.stepSize / 2,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });

        it('should clip collider at the top boundary of outerRect', () => {
          buildOpts.stepSize = 0.2;
          tick.position = 1;
          const label = buildLabel(tick, buildOpts);

          expected = {
            type: 'rect',
            x: 49.9,
            y: 0,
            width: 0.09999999999999859,
            height: buildOpts.innerRect.height
          };

          expect(label.collider).to.deep.equal(expected);
        });
      });
    });
  });

  describe('Line', () => {
    let buildOpts,
      expected;

    beforeEach(() => {
      buildOpts = {
        style: { stroke: 'red', strokeWidth: 1 },
        align: 'bottom',
        innerRect,
        outerRect,
        padding: 10
      };
      expected = { type: 'line', strokeWidth: 1, stroke: 'red', x1: 0, x2: 0, y1: 0, y2: 0 };
    });

    it('Left align', () => {
      buildOpts.align = 'left';
      expected.x1 = innerRect.width - buildOpts.padding - 0.5;
      expected.x2 = innerRect.width - buildOpts.padding - 0.5;
      expected.y2 = 100;
      expect(buildLine(buildOpts)).to.deep.equal(expected);
    });

    it('Right align', () => {
      buildOpts.align = 'right';
      expected.x1 = buildOpts.padding + 0.5;
      expected.x2 = buildOpts.padding + 0.5;
      expected.y2 = 100;
      expect(buildLine(buildOpts)).to.deep.equal(expected);
    });

    it('Top align', () => {
      buildOpts.align = 'top';
      expected.x2 = 50;
      expected.y1 = innerRect.height - buildOpts.padding - 0.5;
      expected.y2 = innerRect.height - buildOpts.padding - 0.5;
      expect(buildLine(buildOpts)).to.deep.equal(expected);
    });

    it('Bottom align', () => {
      buildOpts.align = 'bottom';
      expected.x2 = 50;
      expected.y1 = buildOpts.padding + 0.5;
      expected.y2 = buildOpts.padding + 0.5;
      expect(buildLine(buildOpts)).to.deep.equal(expected);
    });
  });
});
