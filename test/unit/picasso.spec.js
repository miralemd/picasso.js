import picasso from '../../src/index';

describe('picasso.js', () => {
  it('should expose the correct top-level API', () => {
    expect(typeof picasso.chart).to.equal('function');
    expect(typeof picasso.renderer).to.equal('function');
    expect(typeof picasso.Promise).to.equal('function');
    expect(picasso.Promise).to.equal(global.Promise);
  });

  describe('Promise configuration', () => {
    let myResolve;
    let myReject;
    let MyPromise;

    beforeEach(() => {
      myResolve = () => {};
      myReject = () => {};
      MyPromise = () => {};
      MyPromise.resolve = myResolve;
      MyPromise.reject = myReject;
      picasso.Promise = MyPromise;
    });

    afterEach(() => {
      picasso.Promise = global.Promise;
    });

    it('should be able to configure Promise', () => {
      expect(picasso.Promise).to.equal(MyPromise);
      expect(picasso.Promise.resolve).to.equal(MyPromise.resolve);
      expect(picasso.Promise.reject).to.equal(MyPromise.reject);
    });
  });
});
