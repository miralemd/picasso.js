import { create } from '../../../../../src/core/charts/composer/scales';

describe('composer-scales', () => {
  it('should not throw when source options is not provided', () => {
    let fn = () => create({});
    expect(fn).to.not.throw();
  });

  it('should create linear scale when type option is "linear"', () => {
    let s = create({});
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale with specific min/max', () => {
    let s = create({
      min: 20,
      max: 30
    });
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(20);
    expect(s.max()).to.equal(30);
  });

  it('should create ordinal scale when type option is "ordinal"', () => {
    let s = create({ type: 'ordinal' });
    expect(s.type).to.equal('ordinal');
    expect(s.sources).to.eql([]);
  });

  it('should create color scale when type option is "color"', () => {
    let s = create({ type: 'color' });
    expect(s.type).to.equal('color');
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when no better type fits', () => {
    let s = create({});
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });
});

