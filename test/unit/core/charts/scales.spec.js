import { create } from '../../../../src/core/charts/scales';

describe('scales', () => {
  let deps;
  let scaleFn;
  beforeEach(() => {
    deps = {
      scale: {
        has: sinon.stub(),
        get: sinon.stub()
      }
    };
    scaleFn = () => ({
      min: () => 0,
      max: () => 1
    });
  });
  it('should not throw when source options is not provided', () => {
    const fn = () => create({}, null, deps);
    expect(fn).to.not.throw();
  });

  it('should create a scale of a specific type', () => {
    deps.scale.has.withArgs('custom').returns(true);
    deps.scale.get.returns(scaleFn);
    const s = create({
      type: 'custom'
    }, null, deps);
    expect(s.type).to.equal('custom');
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when no better type fits', () => {
    deps.scale.has.withArgs('linear').returns(true);
    deps.scale.get.returns(scaleFn);
    const s = create({}, null, deps);
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when source fields are measures', () => {
    deps.scale.has.withArgs('linear').returns(true);
    deps.scale.get.returns(scaleFn);
    const dataset = {
      field: sinon.stub()
    };
    const datasetFn = () => dataset;

    dataset.field.withArgs('m1').returns({
      type: () => 'measure',
      min: () => 0,
      max: () => 1
    });
    dataset.field.withArgs('m2').returns({
      type: () => 'measure',
      min: () => 0,
      max: () => 1
    });
    const s = create({
      data: {
        fields: ['m1', 'm2']
      }
    }, datasetFn);
    expect(s.type).to.equal('linear');
  });

  it('should exclude NaN values when calculating the combined min/max', () => {
    const dataset = {
      field: sinon.stub()
    };
    const datasetFn = () => dataset;

    dataset.field.withArgs('m1').returns({
      type: () => 'measure',
      min: () => 'NaN',
      max: () => 90
    });
    dataset.field.withArgs('m2').returns({
      type: () => 'measure',
      min: () => 13,
      max: () => 70
    });
    dataset.field.withArgs('m3').returns({
      type: () => 'measure',
      min: () => -5,
      max: () => 'NaN'
    });
    const s = create({
      data: {
        fields: ['m1', 'm2', 'm3']
      }
    }, datasetFn);
    expect(s.min()).to.equal(-5);
    expect(s.max()).to.equal(90);
  });

  it('should create band scale when source fields are dimensions', () => {
    deps.scale.has.withArgs('band').returns(true);
    deps.scale.get.returns(scaleFn);
    const dataset = {
      field: sinon.stub()
    };
    const datasetFn = () => dataset;

    dataset.field.withArgs('d1').returns({
      type: () => 'dimension',
      values: () => [],
      min: () => 2015,
      max: () => 2017
    });
    const s = create({
      data: {
        fields: ['d1']
      }
    }, datasetFn);
    expect(s.type).to.equal('band');
  });
});
