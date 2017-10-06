import { getPropsInfo } from '../../../../src/core/data/util';

describe('data-util', () => {
  let ds;

  beforeEach(() => {
    ds = {
      field: sinon.stub(),
      key: 'nyckel'
    };
  });

  describe('config-normalizer', () => {
    it('should attach default accessors from field', () => {
      const reduceFn = () => ({});
      const valueFn = () => ({});
      ds.field.withArgs('f').returns({
        key: () => 'country',
        reduce: reduceFn,
        value: valueFn
      });
      const p = getPropsInfo({
        field: 'f'
      }, ds);

      expect(p.main.value).to.equal(valueFn);
      expect(p.main.reduce).to.equal(reduceFn);
    });

    it('should attach custom accessors', () => {
      const reduceFn = () => ({});
      const valueFn = () => ({});
      ds.field.withArgs('f').returns({
        key: () => 'country',
        reduce: 'foo',
        value: 'foooo'
      });
      ds.field.withArgs('f2').returns({
        key: () => 'region',
        reduce: 'reg',
        value: 'regg'
      });
      const p = getPropsInfo({
        field: 'f',
        value: valueFn,
        reduce: reduceFn,
        props: {
          x: {
            field: 'f2', value: 'val', reduce: 'sum'
          }
        }
      }, ds);

      expect(p.main.value).to.equal(valueFn);
      expect(p.main.reduce).to.equal(reduceFn);
      expect(p.props.x.value).to.equal('val');
      expect(p.props.x.reduce).to.be.a.function;
    });

    it('should convert string reducer to a function', () => {
      ds.field.withArgs('f').returns({
        key: () => 'country',
        reduce: 'avg'
      });
      const p = getPropsInfo({
        field: 'f'
      }, ds);

      expect(p.main.reduce).to.be.a.function;
    });

    it('should accept primitives and functions', () => {
      const f = {
        key: () => 'country'
      };
      ds.field.withArgs('f').returns(f);
      const fn = () => 3;
      const p = getPropsInfo({
        field: 'f',
        props: {
          x: 0,
          y: fn
        }
      }, ds);

      expect(p.props.x).to.eql({
        type: 'primitive',
        value: 0
      });
      expect(p.props.y).to.eql({
        field: f,
        type: 'function',
        value: fn
      });
    });
  });
});
