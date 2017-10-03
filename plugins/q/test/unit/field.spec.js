// import * as picasso from '../../../../src/index';

import qField from '../../src/data/field';

describe('q-field', () => {
  let f;

  describe('meta', () => {
    const dd = {
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'wohoo',
        qStateCounts: {}
      },
      id: 'unique',
      cube: { qMode: 'S' },
      fieldExtractor: sinon.stub()
    };
    beforeEach(() => {
      f = qField(dd);
    });

    it('should return id', () => {
      expect(f.id()).to.equal('unique');
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

    it('should identify when the field is a dimension', () => {
      expect(f.type()).to.equal('dimension');
    });

    it('should identify when the field is a measure', () => {
      const m = qField({ meta: {}, cube: {} });
      expect(m.type()).to.equal('measure');
    });

    it('should call field extractor with itself as parameter', () => {
      f.items();
      expect(dd.fieldExtractor).to.have.been.calledWithExactly(f);
    });

    it('should have a formatter', () => {
      const form = f.formatter;
      expect(typeof form).to.eql('function');
    });
  });
});
