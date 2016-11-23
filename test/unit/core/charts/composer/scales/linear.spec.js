import { linear } from '../../../../../../src/core/charts/composer/scales/linear';
import { field } from '../../../../../../src/core/data/field';

describe('Linear data scale', () => {
  let dataScale;
  let fields;
  let settings;
  let truty = [true, {}, [], 42, 'foo', new Date(), -42, 3.14, -3.14, Infinity, -Infinity];
  let falsy = [false, null, undefined, 0, NaN, ''];
  let notNumbers = [{}, 'this is my sock', undefined, NaN, () => {}, '123ABC'];

  beforeEach(() => {
    fields = [
      field().data({ min: 0, max: 10 }),
      field().data({ min: 50, max: 100 })
    ];
    settings = {};
  });

  it('should create a function object', () => {
    dataScale = linear(fields, settings);
    expect(dataScale).to.be.a('function');
  });

  it('should return a scaled value on the function object', () => {
    dataScale = linear(fields, settings);
    expect(dataScale({ value: 100 })).to.equal(1);
  });

  it('should expose the underlaying scale object', () => {
    dataScale = linear(fields, settings);
    expect(dataScale.scale).to.be.a('object');
  });

  it('should use a normalized range', () => {
    dataScale = linear(fields, settings);
    expect(dataScale.scale.range()).to.deep.equal([0, 1]);
  });

  it('should generate a domain based on the min and max of all fields', () => {
    fields.push(field().data({ min: -20, max: 10 }));
    dataScale = linear(fields, settings);
    expect(dataScale.scale.domain()).to.deep.equal([-20, 100]);
  });

  it('should default to -1 and 1 as domain if data range and data value is equal to zero', () => {
    fields = [
      field().data({ min: 0, max: 0 })
    ];
    dataScale = linear(fields, settings);
    expect(dataScale.scale.domain()).to.deep.equal([-1, 1]);
  });

  it('should default to -1 and 1 as domain if data range is NaN', () => {
    fields = [
      field().data({ min: NaN, max: NaN })
    ];
    dataScale = linear(fields, settings);
    expect(dataScale.scale.domain()).to.deep.equal([-1, 1]);
  });

  it('should default expand by 10% if data range is equal to zero', () => {
    fields = [
      field().data({ min: 10, max: 10 })
    ];
    dataScale = linear(fields, settings);
    expect(dataScale.scale.domain()).to.deep.equal([9, 11]);

    fields = [
      field().data({ min: -10, max: -10 })
    ];
    dataScale = linear(fields, settings);
    expect(dataScale.scale.domain()).to.deep.equal([-11, -9]);
  });

  describe('Settings', () => {
    it('should follow a specific predecence for settings effecting the domain', () => {
      // From highest predence to lowest: min/max, include, expand
      settings.expand = 1; // Takes predence over default domain
      settings.include = [-500, 500]; // Takes predence over expand
      dataScale = linear(fields, settings);
      expect(dataScale.scale.domain()).to.deep.equal([-500, 500]);

      settings.min = -555; // Takes predence over expand and include
      settings.max = 555; // Takes predence over expand and include
      dataScale = linear(fields, settings);
      expect(dataScale.scale.domain()).to.deep.equal([-555, 555]);
    });

    describe('Invert', () => {
      it('should be possible to invert the scale using a boolean', () => {
        settings.invert = true;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.range()).to.deep.equal([1, 0]);
      });

      it('should be possible to invert the scale using a function', () => {
        settings.invert = () => true;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.range()).to.deep.equal([1, 0]);
      });

      it('should handle truty values', () => {
        truty.forEach((t) => {
          settings.invert = t;
          dataScale = linear(fields, settings);
          expect(dataScale.scale.range()).to.deep.equal([1, 0], `truty value ${t} was not handled correctly`);
        });
      });

      it('should handle falsy values', () => {
        falsy.forEach((t) => {
          settings.invert = t;
          dataScale = linear(fields, settings);
          expect(dataScale.scale.range()).to.deep.equal([0, 1], `falsy value ${t} was not handled correctly`);
        });
      });
    });

    describe('Expand', () => {
      it('should be possible to expand the domain using a number', () => {
        settings.expand = 0.1;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-10, 110]);
      });

      it('should be possible to expand the domain using a function', () => {
        settings.expand = () => 1;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-100, 200]);
      });

      it('should ignore non-numeric values', () => {
        notNumbers.forEach((n) => {
          settings.expand = n;
          dataScale = linear(fields, settings);
          expect(dataScale.scale.domain()).to.deep.equal([0, 100]);
        });
      });

      it('should not be applied if data range and data value is equal to zero', () => {
        fields = [
          field().data({ min: 0, max: 0 })
        ];
        settings.expand = 10;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-1, 1]);
      });

      it('should not be applied if data range is equal to zero', () => {
        fields = [
          field().data({ min: 10, max: 10 })
        ];
        settings.expand = 10;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([9, 11]);
      });
    });

    describe('Min/Max', () => {
      it('should be possible to set min/max the domain using a number', () => {
        settings.min = -200;
        settings.max = 300;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-200, 300]);
      });

      it('should be possible to set min/max the domain using a function', () => {
        settings.min = () => -250;
        settings.max = () => -100;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, -100]);
      });

      it('should ignore non-numeric values', () => {
        notNumbers.forEach((n) => {
          settings.min = () => n;
          settings.max = () => n;
          dataScale = linear(fields, settings);
          expect(dataScale.scale.domain()).to.deep.equal([0, 100]);
        });
      });

      it('should be applied if data range and data value is equal to zero', () => {
        fields = [
          field().data({ min: 0, max: 0 })
        ];
        settings.min = -250;
        settings.max = -100;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, -100]);
      });

      it('should be applied if data range is equal to zero', () => {
        fields = [
          field().data({ min: 10, max: 10 })
        ];
        settings.min = -250;
        settings.max = -100;
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, -100]);
      });
    });

    describe('Include', () => {
      it('should be possible to set a range of values to include in the domain using an Array', () => {
        settings.include = [-250, 0, 10, 2000];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 2000]);
      });

      it('should be possible to set a range of values to include in the domain using a function', () => {
        settings.include = () => [-250, 0, 10, 2000];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 2000]);
      });

      it('should handle when input array contains non-numeric values', () => {
        settings.include = () => [-250].concat(notNumbers);
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 100]);
      });

      it('should be applied if data range and data value is equal to zero', () => {
        fields = [
          field().data({ min: 0, max: 0 })
        ];
        settings.include = [-250, 0, 10, 100];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 100]);
      });

      it('should be applied if data range is equal to zero', () => {
        fields = [
          field().data({ min: 10, max: 10 })
        ];
        settings.include = [-250, 0, 10, 100];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 100]);
      });

      it('should only extend domain if included values are above or below current domain range', () => {
        // Default range is 0-100
        settings.include = () => [-250, 0];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([-250, 100]);

        settings.include = () => [10, 500];
        dataScale = linear(fields, settings);
        expect(dataScale.scale.domain()).to.deep.equal([0, 500]);
      });
    });
  });
});