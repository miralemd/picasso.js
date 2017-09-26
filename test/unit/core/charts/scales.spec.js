import { create } from '../../../../src/core/charts/scales';

describe('scales', () => {
  let reg;
  let scaleFn;
  beforeEach(() => {
    reg = {
      has: sinon.stub(),
      get: sinon.stub()
    };
    scaleFn = () => ({
      min: () => 0,
      max: () => 1
    });
  });
  it('should not throw when source options is not provided', () => {
    const fn = () => create({}, null, reg);
    expect(fn).to.not.throw();
  });

  it('should create a scale of a specific type', () => {
    reg.has.withArgs('custom').returns(true);
    reg.get.returns(scaleFn);
    const s = create({
      type: 'custom'
    }, null, reg);
    expect(s.type).to.equal('custom');
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when no better type fits', () => {
    reg.has.withArgs('linear').returns(true);
    reg.get.returns(scaleFn);
    const s = create({}, null, reg);
    expect(s.type).to.equal('linear');
    expect(s.min()).to.equal(0);
    expect(s.max()).to.equal(1);
    expect(s.sources).to.eql([]);
  });

  it('should create linear scale when source fields are measures', () => {
    reg.has.withArgs('linear').returns(true);
    reg.get.returns(scaleFn);
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
    }, dataset, reg);
    expect(s.type).to.equal('linear');
  });

  it('should create band scale when source fields are dimensions', () => {
    reg.has.withArgs('band').returns(true);
    reg.get.returns(scaleFn);
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
    }, dataset, reg);
    expect(s.type).to.equal('band');
  });
});
