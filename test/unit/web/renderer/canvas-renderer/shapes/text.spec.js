import * as textManipulation from '../../../../../../src/web/renderer/text-manipulation';
import { measureText } from '../../../../../../src/web/renderer/text-metrics';
import { render } from '../../../../../../src/web/renderer/canvas-renderer/shapes/text';

describe('text', () => {
  describe('render', () => {
    let text;

    const sandbox = sinon.sandbox.create(),
      g = {
        beginPath: sandbox.spy(),
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: sandbox.spy()
      };

    sandbox.stub(textManipulation, 'ellipsText', () => '...');

    beforeEach(() => {
      text = {
        x: 1,
        y: 2,
        'font-size': '15px',
        'font-family': 'sans',
        'text-anchor': '',
        'dominant-baseline': ''
      };
    });

    afterEach(() => {
      sandbox.reset();
    });

    after(() => {
      sandbox.restore();
    });

    it('should set font correctly', () => {
      render(text, { g });

      expect(g.font).to.equal('15px sans');
    });

    it('should fire ellipsText with correct arguments', () => {
      render(text, { g });

      expect(textManipulation.ellipsText.calledOnce).to.equal(true);
      expect(textManipulation.ellipsText.alwaysCalledWithExactly(text, measureText)).to.equal(true);
    });

    it('should fire fillText with correct arguments', () => {
      render(text, { g });

      expect(g.fillText.calledOnce).to.equal(true);
      expect(g.fillText.alwaysCalledWithExactly('...', 1, 2)).to.equal(true);
    });

    describe('textAlign', () => {
      const cases = [
        { value: 'left', expected: 'left' },
        { value: 'right', expected: 'right' },
        { value: 'center', expected: 'center' },
        { value: 'start', expected: 'start' },
        { value: 'end', expected: 'end' },
        { value: 'middle', expected: 'center' },
        { value: 'inherit', expected: 'inherit' }
      ];

      cases.forEach((fixture) => {
        it(`should be set correctly when text-anchor is ${fixture.value}`, () => {
          text['text-anchor'] = fixture.value;

          render(text, { g });

          expect(g.textAlign).to.equal(fixture.expected);
        });
      });
    });

    describe('textBaseline', () => {
      const cases = [
        { value: 'top', expected: 'top' },
        { value: 'hanging', expected: 'hanging' },
        { value: 'middle', expected: 'middle' },
        { value: 'alphabetic', expected: 'alphabetic' },
        { value: 'ideographic', expected: 'ideographic' },
        { value: 'bottom', expected: 'bottom' },
        { value: 'auto', expected: 'auto' },
        { value: 'use-script', expected: 'use-script' },
        { value: 'no-change', expected: 'no-change' },
        { value: 'reset-size', expected: 'reset-size' },
        { value: 'mathematical', expected: 'mathematical' },
        { value: 'central', expected: 'middle' },
        { value: 'text-after-edge', expected: 'bottom' },
        { value: 'text-before-edge', expected: 'top' },
        { value: 'inherit', expected: 'inherit' }
      ];

      cases.forEach((fixture) => {
        it(`should be set correctly when dominant-baseline is ${fixture.value}`, () => {
          text['dominant-baseline'] = fixture.value;

          render(text, { g });

          expect(g.textBaseline).to.equal(fixture.expected);
        });
      });
    });
  });
});
