import { default as extend } from 'extend';
import { generateContinuousTicks, generateDiscreteTicks } from '../../../../../src/core/chart-components/axis/axis-tick-generators';
import { continuousDefaultSettings } from '../../../../../src/core/chart-components/axis/axis-default-settings';
import { linear } from '../../../../../src/core/scales/linear';
import { band } from '../../../../../src/core/scales/band';
import { formatter } from '../../../../../src/core/formatter';

describe('Tick generators', () => {
  let settings;
  let styleSettings;
  let scale;
  const d3formatter = formatter('d3')('number')('');
  let input;

  describe('continues tick generator', () => {
    let innerRect;
    beforeEach(() => {
      innerRect = { width: 500, height: 100, x: 0, y: 0 };
      [settings, styleSettings] = continuousDefaultSettings();
      extend(true, settings, styleSettings);
      scale = linear();
      input = { settings, innerRect, scale, formatter: d3formatter };
    });

    it('should output ticks in the correct format', () => {
      settings.ticks.count = 2;
      const ticks = generateContinuousTicks(input);
      const expected = [
        { position: 0, label: '0', isMinor: false },
        { position: 0.5, label: '0.5', isMinor: false },
        { position: 1, label: '1', isMinor: false }
      ];
      expect(ticks).to.deep.equal(expected);
    });

    it('should generate ticks by values', () => {
      settings.ticks.values = [0.1, 0.3];
      const ticks = generateContinuousTicks(input);
      expect(ticks[0].position).to.equal(0.1);
      expect(ticks[1].position).to.equal(0.3);
    });

    it('should generate ticks by count', () => {
      settings.ticks.count = 10;
      const ticks = generateContinuousTicks(input);
      expect(ticks.length).to.deep.equal(11);
    });

    it('should generate ticks by count with minor ticks', () => {
      settings.ticks.count = 5;
      settings.minorTicks.show = true;
      settings.minorTicks.count = 1;
      const ticks = generateContinuousTicks(input);
      expect(ticks.length).to.equal(11);
      expect(ticks.filter(t => t.isMinor).length).to.equal(5);
    });

    it('should generate ticks by distance, aligned vertically', () => {
      const ticks = generateContinuousTicks(input);
      expect(ticks.length).to.equal(3);
    });

    it('should generate ticks by distance, aligned horizontally', () => {
      settings.align = 'bottom';
      const ticks = generateContinuousTicks(input);
      expect(ticks.length).to.equal(6);
    });

    it('should generate tight ticks by distance', () => {
      settings.ticks.tight = true;
      const ticks = generateContinuousTicks(input);
      expect(ticks[0].position).to.equal(scale.range()[0]);
      expect(ticks[ticks.length - 1].position).to.equal(scale.range()[1]);
    });

    it('should generate ticks by distance with minor ticks', () => {
      settings.minorTicks.show = true;
      settings.minorTicks.count = 1;
      const ticks = generateContinuousTicks(input);
      expect(ticks.length).to.equal(3);
      expect(ticks.filter(t => t.isMinor).length).to.equal(1);
    });

    it('should be able to force ticks at bounds', () => {
      settings.ticks.tight = false;
      settings.ticks.forceBounds = true;
      scale.domain([-99842.82122359527, 99888.12805374675]);
      const ticks = generateContinuousTicks(input);
      expect(ticks[0].position).to.equal(scale.range()[0]);
      expect(ticks[ticks.length - 1].position).to.equal(scale.range()[1]);
    });
  });

  describe('discrete tick generator', () => {
    let data;

    beforeEach(() => {
      data = ['d1', 'd2', 'd3'];
    });

    it('should generate ticks by data', () => {
      scale = band(data, [0, 1]);
      const ticks = generateDiscreteTicks({ data, scale });
      const expected = [
        { position: 0, label: 'd1' },
        { position: 0.3333333333333333, label: 'd2' },
        { position: 0.6666666666666666, label: 'd3' }
      ];
      expect(ticks).to.deep.equal(expected);
    });

    it('should generate ticks by index', () => {
      scale = band([0, 1, 2], [0, 1]);
      const ticks = generateDiscreteTicks({ data, scale });
      const expected = [
        { position: 0, label: 'd1' },
        { position: 0.3333333333333333, label: 'd2' },
        { position: 0.6666666666666666, label: 'd3' }
      ];
      expect(ticks).to.deep.equal(expected);
    });
  });
});
