import { create } from '../../../../src/core/charts/scales';

describe('scales', () => {
  it('should not throw when source options is not provided', () => {
    const fn = () => create({});
    expect(fn).to.not.throw();
  });

  it('should create linear scale when type option is "linear"', () => {
    const s = create({});
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale with specific min/max', () => {
    const s = create({
      min: 20,
      max: 30
    });
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(20);
    expect(s.max()).to.equal(30);
  });

  it('should create band scale when type option is "band"', () => {
    const s = create({ type: 'band' });
    expect(s.type).to.equal('band');
    expect(s.sources).to.eql([]);
  });

  it('should create sequential color scale when type option is "sequential-color"', () => {
    const s = create({ type: 'sequential-color' });
    expect(s.type).to.equal('sequential-color');
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when no better type fits', () => {
    const s = create({});
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when source fields are measures', () => {
    const dataset = {
      findField: sinon.stub()
    };

    dataset.findField.withArgs('m1').returns({ field: {
      type: () => 'measure',
      min: () => 0,
      max: () => 1
    } });
    dataset.findField.withArgs('m2').returns({ field: {
      type: () => 'measure',
      min: () => 0,
      max: () => 1
    } });
    const s = create({
      source: ['m1', 'm2']
    }, dataset);
    expect(s.type).to.equal('linear');
  });

  it('should exclude NaN values when calculating the combined min/max', () => {
    const dataset = {
      findField: sinon.stub()
    };

    dataset.findField.withArgs('m1').returns({ field: {
      type: () => 'measure',
      min: () => 'NaN',
      max: () => 90
    } });
    dataset.findField.withArgs('m2').returns({ field: {
      type: () => 'measure',
      min: () => 13,
      max: () => 70
    } });
    dataset.findField.withArgs('m3').returns({ field: {
      type: () => 'measure',
      min: () => -5,
      max: () => 'NaN'
    } });
    const s = create({
      source: ['m1', 'm2', 'm3']
    }, dataset);
    expect(s.min()).to.equal(-5);
    expect(s.max()).to.equal(90);
  });

  it('should create band scale when source fields are dimensions', () => {
    const dataset = {
      findField: sinon.stub()
    };

    dataset.findField.withArgs('d1').returns({ field: {
      type: () => 'dimension',
      values: () => [],
      min: () => 2015,
      max: () => 2017
    } });
    const s = create({
      source: ['d1']
    }, dataset);
    expect(s.type).to.equal('band');
  });
});
