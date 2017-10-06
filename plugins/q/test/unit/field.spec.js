// import * as picasso from '../../../../src/index';

import qField from '../../src/data/field';

describe('q-field', () => {
  function mField(mode, fe) {
    return qField({
      meta: {
        qMin: 1,
        qMax: 2,
        qTags: ['a', 'b'],
        qFallbackTitle: 'measure',
        qNumFormat: {
          qType: 'M'
        }
      },
      id: 'unique',
      cube: { qMode: mode || 'S' },
      fieldExtractor: fe
    });
  }

  function dimField(mode, fe) {
    return qField({
      meta: {
        qTags: ['a', 'b'],
        qFallbackTitle: 'dimension',
        qStateCounts: {}
      },
      id: 'unique',
      cube: { qMode: mode || 'S' },
      fieldExtractor: fe
    });
  }

  describe('meta', () => {
    it('should return id', () => {
      let f = dimField();
      expect(f.id()).to.equal('unique');
    });

    it('should return min value', () => {
      let f = mField();
      expect(f.min()).to.equal(1);
    });

    it('should return max value', () => {
      let f = mField();
      expect(f.max()).to.equal(2);
    });

    it('should return tags', () => {
      let f = mField();
      expect(f.tags()).to.deep.equal(['a', 'b']);
    });

    it('should return title', () => {
      let f = mField();
      expect(f.title()).to.equal('measure');
    });

    it('should identify when the field is a dimension', () => {
      let f = dimField();
      expect(f.type()).to.equal('dimension');
    });

    it('should identify an attribute dimension as a dimension', () => {
      let f = dimField();
      expect(f.type()).to.equal('dimension');
    });

    it('should identify when the field is a measure', () => {
      let f = mField();
      expect(f.type()).to.equal('measure');
    });

    it('should call field extractor with itself as parameter', () => {
      let fe = sinon.stub();
      let f = dimField('', fe);
      f.items();
      expect(fe).to.have.been.calledWithExactly(f);
    });

    it('should not call field extractor more than once', () => {
      let fe = sinon.stub().returns({});
      let f = dimField('', fe);
      f.items();
      f.items();
      f.items();
      expect(fe.callCount).to.equal(1);
    });

    it('should have a formatter', () => {
      let f = mField();
      const form = f.formatter();
      expect(typeof form).to.eql('function');
    });

    it('should have a default reducer of "avg" for a measure', () => {
      let f = mField();
      expect(f.reduce).to.eql('avg');
    });

    it('should have a default reducer of "first" for a dimension', () => {
      let f = dimField();
      expect(f.reduce).to.eql('first');
    });
  });
});
