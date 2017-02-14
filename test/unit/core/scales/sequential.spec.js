import sequential from '../../../../src/core/scales/color/sequential';

describe('Sequential', () => {
  let seq;
  beforeEach(() => {
    seq = sequential();
  });

  describe('Basic colors', () => {
    it('should scale two rgb colors', () => {
      const c = seq.domain([0, 1]).range(['red', 'blue']).get(0.5);
      expect(c).to.equal('rgb(128, 0, 128)');
    });

    it('should scale two hsl colors', () => {
      const c = seq.domain([0, 1]).range(['hsl(120,50%,10%)', 'hsl(360,100%,50%)']).get(0.5);
      expect(c).to.equal('rgb(134, 19, 6)');
    });

    it('should scale rgb color to a hsl color', () => {
      const c = seq.domain([0, 1]).range(['blue', 'hsl(360,100%,50%)']).get(0.5);
      expect(c).to.equal('rgb(128, 0, 128)');
    });

    it('should scale hsl color to a rgb color', () => {
      const c = seq.domain([0, 1]).range(['hsl(360,100%,50%)', 'blue']).get(0.5);
      expect(c).to.equal('rgb(128, 0, 128)');
    });

    it('should scale a single color over lightness', () => {
      seq.domain([0, 1]).range(['hsl(0, 100%, 20%)', 'hsl(0, 100%, 80%)']);
      expect(seq.get(0)).to.equal('rgb(102, 0, 0)');
      expect(seq.get(1)).to.equal('rgb(255, 153, 153)');
    });

    it('should scale a single color over lightness when using classify', () => {
      seq.domain([0, 1]).range(['hsl(0, 100%, 20%)', 'hsl(0, 100%, 80%)']).classify(4);
      expect(seq.get(0)).to.equal('rgb(121, 19, 19)'); // First interval
      expect(seq.get(0.2)).to.equal('rgb(121, 19, 19)');
      expect(seq.get(0.5)).to.equal('rgb(198, 96, 96)'); // Second interval
      expect(seq.get(0.6)).to.equal('rgb(198, 96, 96)');
      expect(seq.get(0.75)).to.equal('rgb(236, 134, 134)'); // Thrid interval
      expect(seq.get(0.85)).to.equal('rgb(236, 134, 134)');
      expect(seq.get(0.90)).to.equal('rgb(236, 134, 134)'); // Fourth interval
      expect(seq.get(1)).to.equal('rgb(236, 134, 134)');
    });
  });

  describe('Generate limits', () => {
    let min = 0;
    let max = 100;
    let settings = {};
    const fields = [{ min: () => min, max: () => max }];

    beforeEach(() => {
      min = 0;
      max = 100;
      settings = {};
    });
    it('should add limits if missing', () => {
      settings.colors = ['red', 'green', 'blue'];
      seq = sequential(settings, fields);
      expect(seq.domain()).to.deep.equal([0, 50, 100]);
    });

    it('should use input limits if exists', () => {
      settings.colors = ['red', 'green', 'blue'];
      settings.limits = [0, 25, 100];
      seq = sequential(settings, fields);
      expect(seq.domain()).to.deep.equal([0, 25, 100]);
    });
    it('should generate more limits', () => {
      settings.colors = ['red', 'green', 'blue', 'purple', 'yellow', 'magenta', 'pink', 'azure', 'black', 'white', 'brown'];
      seq = sequential(settings, fields);
      expect(seq.domain()).to.deep.equal([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    });
  });
});
