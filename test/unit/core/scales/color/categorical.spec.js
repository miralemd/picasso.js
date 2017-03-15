import categorical from '../../../../../src/core/scales/color/categorical';

describe('categorical', () => {
  it('should return greyish color for unknown values (default)', () => {
    let s = categorical();
    expect(categorical.unknown).to.equal('#d2d2d2');
    expect(s()).to.equal(categorical.unknown);
  });

  it('should return red color for unknown values', () => {
    let s = categorical({
      unknown: 'red'
    });
    expect(s()).to.equal('red');
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

  describe('explicit', () => {
    let s;
    beforeEach(() => {
      s = categorical({
        domain: ['Sweden', 'Italy', 'England', 'France', 'Canada'],
        range: ['blue', 'red'],
        explicit: {
          domain: ['Italy', 'USA', 'Sweden'],
          range: ['green', 'starspangled', 'yellow']
        }
      });
    });

    it('should not modify domain when explicit domain is set', () => {
      expect(s.domain()).to.eql(['Sweden', 'Italy', 'England', 'France', 'Canada']);
    });

    it('should modify range when explicit range and domain are set', () => {
      expect(s.range()).to.eql(['yellow', 'green', 'blue', 'red', 'blue']);
    });

    it('should return custom color for "Italy"', () => {
      expect(s('Italy')).to.equal('green');
    });
  });
});
