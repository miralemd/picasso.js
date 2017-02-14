import threshold from '../../../../src/core/scales/color/threshold';

describe('Threshold', () => {
  let ths;
  beforeEach(() => {
    ths = threshold();
  });

  describe('basic colors', () => {

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
      settings.colors = ['red', 'green', 'blue'];
      max = 75;
      ths = threshold(settings, fields);
      expect(ths.domain()).to.deep.equal([25, 50]);
    });

    it('should generate 9 breaks from 10 colors', () => {
      settings.colors = ['red', 'green', 'blue', 'purple', 'yellow', 'magenta', 'pink', 'azure', 'black', 'white'];
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
      settings.colors = ['black', 'white'];
      settings.limits = [25, 50];
      max = 75;
      ths = threshold(settings, fields);
      expect(ths.range()).to.deep.equal(['rgb(0, 0, 0)', 'rgb(128, 128, 128)', 'rgb(255, 255, 255)']);
    });
  });
});
