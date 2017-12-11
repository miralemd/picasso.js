import formatter from '../../../../src/core/formatter';

describe('formatter', () => {
  it('should return the default d3 number formatter', () => {
    expect(formatter('d3-number')).to.be.a.function;
    expect(formatter('d3-number').format).to.be.a.function;
    expect(formatter('d3-number').locale).to.be.a.function;
  });

  it('should return the default d3 time formatter', () => {
    expect(formatter('d3-time')).to.be.a.function;
    expect(formatter('d3-time').format).to.be.a.function;
    expect(formatter('d3-time').locale).to.be.a.function;
    expect(formatter('d3-time').parse).to.be.a.function;
    expect(formatter('d3-time').parsePattern).to.be.a.function;
  });
});