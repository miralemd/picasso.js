import threshold from '../../../../../src/core/scales/color/threshold';

describe('Threshold', () => {
  let ths;
  beforeEach(() => {
    ths = threshold();
  });

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
      expect(ths.range()).to.deep.equal(['red', 'blue']);
    });

    it('max/min settings', () => {
      settings.min = 20;
      settings.max = 100;
      ths = threshold(settings);
      expect(ths.domain()).to.deep.equal([60]);
      expect(ths.range()).to.deep.equal(['red', 'blue']);
    });

    it('invalid max/min settings', () => {
      settings.min = 'oops';
      settings.max = 'ooooops';
      ths = threshold(settings);
      expect(ths.domain()).to.deep.equal([NaN]);
      expect(ths.range()).to.deep.equal(['red', 'blue']);
    });

    it('only fields', () => {
      ths = threshold({}, fields);
      expect(ths.domain()).to.deep.equal([50]);
      expect(ths.range()).to.deep.equal(['red', 'blue']);
    });

    it('invalid max/min on fields', () => {
      fields[0].min = () => 'oops';
      fields[0].max = () => 'ooops';
      ths = threshold({}, fields);
      expect(ths.domain()).to.deep.equal([0.5]);
      expect(ths.range()).to.deep.equal(['red', 'blue']);
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

    it('should generate 3 colors from 2 breaks', () => {
      settings.range = ['black', 'white'];
      settings.domain = [25, 50];
      max = 75;
      ths = threshold(settings, fields);
      expect(ths.range()).to.deep.equal(['rgb(0, 0, 0)', 'rgb(128, 128, 128)', 'rgb(255, 255, 255)']);
    });
    it('should generate 6 colors from 5 breaks', () => {
      settings.range = ['black', 'white'];
      settings.domain = [5, 15, 25, 35, 45];
      max = 50;
      ths = threshold(settings, fields);
      const result = [0, 51, 102, 153, 204, 255].map(v => `rgb(${v}, ${v}, ${v})`);
      expect(ths.range()).to.deep.equal(result);
    });
  });
});
