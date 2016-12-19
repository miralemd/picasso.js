import {
  reducers
} from '../../../../src/core/data/data-mapper';

describe('data-mapper', () => {
  describe('reducers', () => {
    let values = [2, -1, 4, 3];
    it('first', () => {
      expect(reducers.first(values)).to.equal(2);
    });

    it('last', () => {
      expect(reducers.last(values)).to.equal(3);
    });

    it('min', () => {
      expect(reducers.min(values)).to.equal(-1);
    });

    it('max', () => {
      expect(reducers.max(values)).to.equal(4);
    });

    it('sum', () => {
      expect(reducers.sum(values)).to.equal(8);
    });

    it('avg', () => {
      expect(reducers.avg(values)).to.equal(2);
    });
  });

  describe('reducers containing valid and null data', () => {
    let values = [undefined, 2, -1, null, 4, NaN, '', 3];
    it('first', () => {
      expect(reducers.first(values)).to.equal(undefined);
    });

    it('last', () => {
      expect(reducers.last(values)).to.equal(3);
    });

    it('min', () => {
      expect(reducers.min(values)).to.equal(-1);
    });

    it('max', () => {
      expect(reducers.max(values)).to.equal(4);
    });

    it('sum', () => {
      expect(reducers.sum(values)).to.equal(8);
    });

    it('avg', () => {
      expect(reducers.avg(values)).to.equal(2);
    });
  });

  describe('reducers containing only null data', () => {
    /* eslint no-unused-expressions: 0*/
    let values = [undefined, null, NaN, ''];
    it('first', () => {
      expect(reducers.first(values)).to.equal(undefined);
    });

    it('last', () => {
      expect(reducers.last(values)).to.equal('');
    });

    it('min', () => {
      expect(reducers.min(values)).to.be.NaN;
    });

    it('max', () => {
      expect(reducers.max(values)).to.be.NaN;
    });

    it('sum', () => {
      expect(reducers.sum(values)).to.be.NaN;
    });

    it('avg', () => {
      expect(reducers.avg(values)).to.be.NaN;
    });
  });
});
