import buildLabel from '../../../../../src/core/chart-components/axis/axis-label-node';

describe('Axis Label Node', () => {
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
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.y = 100;
        expected.dy = 0;
     //   expected.baseline = 'text-after-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label with margin', () => {
        outerRect.height = 105;
        tick.position = 1;
        expected.y = 100;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.y = 0;
        expected.dy = 10;
      //  expected.baseline = 'text-before-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label with margin', () => {
        innerRect.y = 5;
        tick.position = 0;
        expected.y = 5;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.y = 100;
        expected.dy = 0;
      //  expected.baseline = 'text-after-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label with margin', () => {
        outerRect.height = 105;
        tick.position = 1;
        expected.y = 100;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.y = 0;
        expected.dy = 10;
       // expected.baseline = 'text-before-edge';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label with margin', () => {
        innerRect.y = 5;
        tick.position = 0;
        expected.y = 5;
       // expected.baseline = 'central';
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.x = 0;
        expected.anchor = 'start';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label with margin', () => {
        tick.position = 0;
        innerRect.x = 5;
        expected.x = 5;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.x = 50;
        expected.anchor = 'end';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label with margin', () => {
        tick.position = 1;
        outerRect.width = 65;
        expected.x = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label', () => {
        tick.position = 0;
        expected.x = 0;
        expected.anchor = 'start';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('start label with margin', () => {
        tick.position = 0;
        innerRect.x = 5;
        expected.x = 5;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label', () => {
        tick.position = 1;
        expected.x = 50;
        expected.anchor = 'end';
        expected.maxWidth *= 0.75;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
      });

      it('end label with margin', () => {
        tick.position = 1;
        outerRect.width = 65;
        expected.x = 50;
        expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
        });
        it('60deg', () => {
          expected.y = 10 + ((buildOpts.maxHeight * Math.cos(rad60)) / 2);
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad60)) / 2);
          expected.transform = `rotate(-60, ${expected.x}, ${expected.y})`;
          buildOpts.angle = 60;
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
        });
        it('-45deg', () => {
          expected.y = 10 + ((buildOpts.maxHeight * Math.cos(-rad45)) / 2);
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(-rad45)) / 2);
          expected.transform = `rotate(45, ${expected.x}, ${expected.y})`;
          expected.anchor = 'start';
          buildOpts.angle = -45;
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
        });
        it('60deg', () => {
          buildOpts.angle = 60;
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(rad60)) / 3);
          expected.y = 90;
          expected.transform = `rotate(-60, ${expected.x}, ${expected.y})`;
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
        });
        it('-45deg', () => {
          buildOpts.angle = -45;
          expected.anchor = 'end';
          expected.x = 25 - ((buildOpts.maxHeight * Math.sin(-rad45)) / 3);
          expected.y = 90; // Bottom of the rect - padding
          expected.transform = `rotate(45, ${expected.x}, 90)`;
          expect(buildLabel(tick, buildOpts)).to.deep.include(expected);
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
});
