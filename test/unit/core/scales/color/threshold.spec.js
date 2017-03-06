import threshold from '../../../../../src/core/scales/color/threshold';

describe('Threshold', () => {
  let ths;

  const defaultColors = ['rgb(180,221,212)', 'rgb(34, 83, 90)'];

  describe('basics', () => {
    let min = 0;
    let max = 100;
    let settings = {};
    const fields = [{ min: () => min, max: () => max }];

    beforeEach(() => {
      min = 0;
      max = 100;
      settings = {};
    });

    it('default settings', () => {
      ths = threshold();
      expect(ths.domain()).to.deep.equal([0.5]);
      expect(ths.range()).to.deep.equal(defaultColors);
    });

    it('max/min settings', () => {
      settings.min = 20;
      settings.max = 100;
      ths = threshold(settings);
      expect(ths.domain()).to.deep.equal([60]);
      expect(ths.range()).to.deep.equal(defaultColors);
    });

    it('invalid max/min settings', () => {
      settings.min = 'oops';
      settings.max = 'ooooops';
      ths = threshold(settings);
      expect(ths.domain()).to.deep.equal([NaN]);
      expect(ths.range()).to.deep.equal(defaultColors);
    });

    it('only fields', () => {
      ths = threshold({}, fields);
      expect(ths.domain()).to.deep.equal([50]);
      expect(ths.range()).to.deep.equal(defaultColors);
    });

    it('invalid max/min on fields', () => {
      fields[0].min = () => 'oops';
      fields[0].max = () => 'ooops';
      ths = threshold({}, fields);
      expect(ths.domain()).to.deep.equal([0.5]);
      expect(ths.range()).to.deep.equal(defaultColors);
    });
  });

  describe('generate thresholds', () => {
    let min = 0;
    let max = 100;
    let settings = {};
    const fields = [{ min: () => min, max: () => max }];

    beforeEach(() => {
      min = 0;
      max = 100;
      settings = {};
    });

    it('should generate 1 break from 2 colors', () => {
      settings.range = ['red', 'green'];
      ths = threshold(settings, fields);
      expect(ths.domain()).to.deep.equal([50]);
    });

    it('should generate 1 break from 2 colors when domain is empty', () => {
      settings.range = ['red', 'green'];
      settings.domain = [];
      min = 80;
      ths = threshold(settings, fields);
      expect(ths.domain()).to.deep.equal([90]);
    });

    it('should generate 2 breaks from 3 colors', () => {
      settings.range = ['red', 'green', 'blue'];
      max = 75;
      ths = threshold(settings, fields);
      expect(ths.domain()).to.deep.equal([25, 50]);
    });

    it('should generate 9 breaks from 10 colors', () => {
      settings.range = ['red', 'green', 'blue', 'purple', 'yellow', 'magenta', 'pink', 'azure', 'black', 'white'];
      max = 100;
      ths = threshold(settings, fields);
      expect(ths.domain()).to.deep.equal([10, 20, 30, 40, 50, 60, 70, 80, 90]);
    });
  });

  describe('nice domain', () => {
    it('when range is empty', () => {
      ths = threshold({
        nice: true,
        min: -4,
        max: 7.2,
        range: []
      });
      expect(ths.domain()).to.deep.equal([0]);
    });

    it('when range is of length 2 ', () => {
      ths = threshold({
        nice: true,
        min: 1.2,
        max: 7.2,
        range: ['a', 'b']
      });
      expect(ths.domain()).to.deep.equal([4]);
    });

    it('when range is of length 3', () => {
      ths = threshold({
        nice: true,
        min: 1.2,
        max: 7.2,
        range: ['a', 'b', 'c']
      });
      expect(ths.domain()).to.deep.equal([4, 6]);
    });

    it('when range and domain are equal', () => {
      ths = threshold({
        nice: true,
        min: 1,
        max: 9,
        range: ['a', 'b', 'c']
      });
      expect(ths.domain()).to.deep.equal([5, 10]);
    });

    it('when range is of length 4', () => {
      ths = threshold({
        nice: true,
        min: 13,
        max: 43,
        range: ['a', 'b', 'c', 'd']
      });
      expect(ths.domain()).to.deep.equal([20, 30, 40]);
    });

    it('when min is negative', () => {
      ths = threshold({
        nice: true,
        min: -79,
        max: 167,
        range: ['a', 'b', 'c', 'd']
      });
      expect(ths.domain()).to.deep.equal([-100, 0, 100]);
    });

    it('when range is of length 5', () => {
      ths = threshold({
        nice: true,
        min: 13,
        max: 43,
        range: ['a', 'b', 'c', 'd', 'e']
      });
      expect(ths.domain()).to.deep.equal([20, 25, 30, 35]);
    });
  });

  describe('generate colors', () => {
    let min = 0;
    let max = 100;
    let settings = {};
    const fields = [{ min: () => min, max: () => max }];

    beforeEach(() => {
      min = 0;
      max = 100;
      settings = {};
    });

    it('should handle min/mix being inside domain', () => {
      ths = threshold({
        range: ['black', 'white'],
        domain: [-10, 10],
        min: -1,
        max: 20
      });
      expect(ths.range()).to.deep.equal(['rgb(0, 0, 0)', 'rgb(128, 128, 128)', 'rgb(255, 255, 255)']);
    });

    it('should generate 3 colors from 2 breaks', () => {
      settings.range = ['black', 'white'];
      settings.domain = [25, 50];
      ths = threshold(settings, fields);
      expect(ths.range()).to.deep.equal(['rgb(0, 0, 0)', 'rgb(128, 128, 128)', 'rgb(255, 255, 255)']);
    });

    it('should generate 6 colors from 5 breaks', () => {
      settings.range = ['black', 'rgb(240, 0, 0)'];
      settings.domain = [5, 15, 25, 35, 45];
      ths = threshold(settings, fields);
      const result = [0, 30, 90, 150, 210, 240].map(v => `rgb(${v}, ${0}, ${0})`);
      expect(ths.range()).to.deep.equal(result);
    });
  });

  describe('return values', () => {
    it('should be NaN when input is invalid', () => {
      ths = threshold();
      expect(ths({})).to.eql(NaN);
    });

    it('should be correct', () => {
      ths = threshold({
        range: ['red', 'green'],
        domain: [10]
      });
      expect(ths({ value: 9 })).to.equal('red');
      expect(ths({ value: 11 })).to.equal('green');
    });

    it('should be correct on borders', () => {
      ths = threshold({
        range: ['red', 'green', 'blue'],
        domain: [10, 20]
      });
      expect(ths({ value: 9 })).to.equal('red');
      expect(ths({ value: 10 })).to.equal('green');
      expect(ths({ value: 20 })).to.equal('blue');
    });
  });
});
