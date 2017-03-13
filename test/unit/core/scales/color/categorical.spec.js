import categorical from '../../../../../src/core/scales/color/categorical';

describe('categorical', () => {
  it('should return greyish color for unknown values', () => {
    let s = categorical();
    expect(categorical.unknown).to.equal('#d2d2d2');
    expect(s()).to.equal(categorical.unknown);
  });

  it('should return default range', () => {
    let s = categorical();
    expect(categorical.range).to.eql([
      '#a54343',
      '#d76c6c',
      '#ec983d',
      '#ecc43d',
      '#f9ec86',
      '#cbe989',
      '#70ba6e',
      '#578b60',
      '#79d69f',
      '#26a0a7',
      '#138185',
      '#65d3da'
    ]);
    expect(s.range()).to.eql(categorical.range);
  });
});
