import { continuousDefaultSettings } from '../../../../../src/core/scales/ticks/default-settings';
import { looseDistanceBasedGenerator } from '../../../../../src/core/scales/ticks/tick-generators';
import linear from '../../../../../src/core/scales/linear';
import band from '../../../../../src/core/scales/band';
import formatter from '../../../../../src/core/formatter';

describe('Tick generators', () => {
  let settings;
  let scale;
  const d3formatter = formatter('d3-number')('');
  let input;

  describe('continues tick generator', () => {
    beforeEach(() => {
      settings = continuousDefaultSettings();
      settings.paddingStart = 0;
      settings.paddingEnd = 10;
      settings.minorTicks = {
        count: 0
      };
      scale = linear();
      input = { settings, distance: 100, scale, formatter: d3formatter };
    });

    describe('formatting', () => {
      it('should output ticks in the correct format', () => {
        settings.ticks.count = 2;
        input.formatter = formatter('d3-number')('-1.0%');
        const ticks = scale.ticks(input);
        const expected = [
          { position: 0, label: '0%', isMinor: false, value: 0 },
          { position: 0.5, label: '50%', isMinor: false, value: 0.5 },
          { position: 1, label: '100%', isMinor: false, value: 1 }
        ];
        expect(ticks).to.deep.equal(expected);
      });
    });

    describe('by values', () => {
      it('should generate ticks by values', () => {
        settings.ticks.values = [0.1, 0.3];
        const ticks = scale.ticks(input);
        expect(ticks[0].position).to.equal(0.1);
        expect(ticks[1].position).to.equal(0.3);
      });

      it('should filter out NaN values', () => {
        settings.ticks.values = [0.1, NaN, '12', 'asd', false, 0.3];
        const ticks = scale.ticks(input);
        expect(ticks[0].position).to.equal(0.1);
        expect(ticks[1].position).to.equal(0.3);
      });

      it('should only generate ticks by values that are witin the domain', () => {
        settings.ticks.values = [-100, -0.1, 0.1, 0.3, 1.1, 123, 2130];
        const ticks = scale.ticks(input);
        const expected = [
          { position: 0.1, label: '0.1', isMinor: false, value: 0.1 },
          { position: 0.3, label: '0.3', isMinor: false, value: 0.3 }
        ];
        expect(ticks).to.deep.equal(expected);
      });

      it('should only generate unique ticks by values', () => {
        settings.ticks.values = [0.1, 0.1, 0.3, 0.4, 0.3, 0.5];
        const ticks = scale.ticks(input);
        expect(ticks.map(t => t.value)).to.deep.equal([0.1, 0.3, 0.4, 0.5]);
      });

      it('should sort ticks by values', () => {
        settings.ticks.values = [0.3, 0.1, 0.5, 0.4];
        const ticks = scale.ticks(input);
        expect(ticks.map(t => t.value)).to.deep.equal([0.1, 0.3, 0.4, 0.5]);
      });
    });

    describe('by count', () => {
      it('should generate ticks by count', () => {
        settings.ticks.count = 10;
        const ticks = scale.ticks(input);
        expect(ticks.length).to.deep.equal(11);
      });

      it('should generate ticks by count with minor ticks', () => {
        settings.ticks.count = 5;
        settings.minorTicks.count = 1;
        const ticks = scale.ticks(input);
        expect(ticks.length).to.equal(11);
        expect(ticks.filter(t => t.isMinor).length).to.equal(5);
      });
    });

    describe('by distance', () => {
      it('should generate ticks by distance', () => {
        const ticks = scale.ticks(input);
        expect(ticks.length).to.equal(3);
      });

      it('should generate tight ticks by distance', () => {
        settings.ticks.tight = true;
        const ticks = scale.ticks(input);
        expect(ticks[0].position).to.equal(scale.range()[0]);
        expect(ticks[ticks.length - 1].position).to.equal(scale.range()[1]);
        expect(ticks).to.be.of.length(3);
      });

      it('should generate tight ticks by a custom distance', () => {
        settings.ticks.tight = true;
        settings.ticks.distance = 20;
        const ticks = scale.ticks(input);
        expect(ticks).to.be.of.length(6);
      });

      it('should generate loose ticks by a custom distance', () => {
        settings.ticks.distance = 20;
        const ticks = scale.ticks(input);
        expect(ticks).to.be.of.length(6);
      });

      it('should generate ticks by distance with minor ticks', () => {
        settings.minorTicks.count = 1;
        const ticks = scale.ticks(input);
        expect(ticks.length).to.equal(5);
        expect(ticks.filter(t => t.isMinor).length).to.equal(2);
      });
    });

    describe('forceBounds', () => {
      it('should be able to force ticks at bounds', () => {
        settings.ticks.tight = false;
        settings.ticks.forceBounds = true;
        scale.domain([-99842.82122359527, 99888.12805374675]);
        const ticks = scale.ticks(input);
        const majorTicks = ticks.filter(t => !t.isMinor);
        expect(majorTicks[0]).to.deep.equal({
          position: 0,
          label: '-99842.8212236',
          isMinor: false,
          value: -99842.82122359527
        });
        expect(majorTicks[majorTicks.length - 1]).to.deep.equal({
          position: 1,
          label: '99888.1280537',
          isMinor: false,
          value: 99888.12805374675
        });
      });

      it('should be able to force ticks at bounds with minorTicks', () => {
        settings.ticks.tight = false;
        settings.ticks.forceBounds = true;
        settings.minorTicks = {
          count: 3 // Should trigger minorTicks on -50 and 450, those should be replace by major ticks
        };
        scale.domain([-50, 450]);
        const ticks = scale.ticks(input);
        const majorTicks = ticks.filter(t => !t.isMinor);

        expect(majorTicks[0]).to.deep.equal({
          position: 0,
          label: '-50',
          isMinor: false,
          value: -50
        });
        expect(majorTicks[majorTicks.length - 1]).to.deep.equal({
          position: 1,
          label: '450',
          isMinor: false,
          value: 450
        });
      });
    });
  });

  describe('looseDistanceBasedGenerator', () => {
    beforeEach(() => {
      scale = linear();
      sinon.spy(scale, 'ticks');
    });

    describe('unitDivider', () => {
      it('should use fallback divider if unitDivider is not a number', () => {
        ['3', 'asd', null, false, true, NaN, () => {}, undefined, ' ', {}].forEach((type) => {
          looseDistanceBasedGenerator({ distance: 100, unitDivider: type, scale });
          expect(scale.ticks).to.have.been.calledWith(2);
        });
      });

      it('should use fallback divider if unitDivider is a negative number', () => {
        looseDistanceBasedGenerator({ distance: 100, unitDivider: -123, scale });
        expect(scale.ticks).to.have.been.calledWith(2);
      });

      it('should use unitDivider if it is a positive number', () => {
        looseDistanceBasedGenerator({ distance: 100, unitDivider: 20, scale });
        expect(scale.ticks).to.have.been.calledWith(100 / 20);
      });

      it('should handle unitDivider of zero', () => {
        looseDistanceBasedGenerator({ distance: 100, unitDivider: 0, scale });
        expect(scale.ticks).to.have.been.calledWith(1000);
      });

      it('should handle very small number on unitDivider', () => {
        looseDistanceBasedGenerator({ distance: 100, unitDivider: 0.0001, scale });
        expect(scale.ticks).to.have.been.calledWith(1000);
      });
    });

    describe('distance', () => {
      it('should handle if distance is not a number', () => {
        ['3', 'asd', null, false, true, NaN, () => {}, undefined, ' ', {}].forEach((type) => {
          looseDistanceBasedGenerator({ distance: type, scale });
          expect(scale.ticks).to.have.been.calledWith(2);
        });
      });

      it('should handle if distance is a negative number', () => {
        looseDistanceBasedGenerator({ distance: -1213, scale });
        expect(scale.ticks).to.have.been.calledWith(2);
      });

      it('should use distance if it is a positive number', () => {
        looseDistanceBasedGenerator({ distance: 2000, scale });
        expect(scale.ticks).to.have.been.calledWith(2000 / 100);
      });

      it('should handle distance of zero', () => {
        looseDistanceBasedGenerator({ distance: 0, scale });
        expect(scale.ticks).to.have.been.calledWith(2);
      });

      it('should handle very small number on distance', () => {
        looseDistanceBasedGenerator({ distance: 0.0001, scale });
        expect(scale.ticks).to.have.been.calledWith(2);
      });
    });
  });

  describe('discrete tick generator', () => {
    let data;

    beforeEach(() => {
      data = ['d1', 'd2', 'd3'];
    });

    it('should generate ticks by data', () => {
      scale = band();
      scale.domain(data);
      scale.range([0, 1]);

      const ticks = scale.ticks();
      const expected = [
        { position: 0 + (scale.bandwidth() / 2), label: 'd1' },
        { position: (1 / 3) + (scale.bandwidth() / 2), label: 'd2' },
        { position: (2 / 3) + (scale.bandwidth() / 2), label: 'd3' }
      ];
      expect(ticks).to.deep.equal(expected);
    });

    it('should support duplicate labels by separating values and labels', () => {
      scale = band({ trackBy: 'id' });
      scale.data = () => ([
        { self: { value: 'alpha' }, id: { value: 'd1' } },
        { self: { value: 'alpha' }, id: { value: 'd2' } },
        { self: { value: 'beta' }, id: { value: 'd3' } }
      ]);
      scale.domain(data);
      scale.range([0, 1]);

      const ticks = scale.ticks();
      const expected = [
        { position: 0 + (scale.bandwidth() / 2), label: 'alpha' },
        { position: (1 / 3) + (scale.bandwidth() / 2), label: 'alpha' },
        { position: (2 / 3) + (scale.bandwidth() / 2), label: 'beta' }
      ];
      expect(ticks).to.deep.equal(expected);
    });
  });
});
