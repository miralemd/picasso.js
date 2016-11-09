import { qField } from '../../../../../src/core/data/q/q-field';

describe('QField', () => {
  let f;
  const dd = {
    meta: {
      qMin: 1,
      qMax: 2,
      qTags: ['a', 'b'],
      qFallbackTitle: 'wohoo'
    },
    matrix: [
      [{}, { qNum: 3, qText: 'tre', qElemNumber: 1 }],
      [{}, { qNum: 7, qText: 'sju', qElemNumber: 2 }],
      [{}, { qNum: 1, qText: 'ett', qElemNumber: 3 }]
    ],
    idx: 1
  };
  beforeEach(() => {
    f = qField();
    f.data(dd);
  });

  it('should return min value', () => {
    expect(f.min()).to.equal(1);
  });

  it('should return max value', () => {
    expect(f.max()).to.equal(2);
  });

  it('should return tags', () => {
    expect(f.tags()).to.deep.equal(['a', 'b']);
  });

  it('should return title', () => {
    expect(f.title()).to.equal('wohoo');
  });

  it('should return values', () => {
    const values = f.values();
    expect(values).to.deep.equal([
      { value: 3, label: 'tre', id: 1 },
      { value: 7, label: 'sju', id: 2 },
      { value: 1, label: 'ett', id: 3 }
    ]);
  });
});
