import * as picasso from '../../src/index';
import createElement from '../mocks/element-mock';

describe('picasso.js', () => {
  it('should expose the correct top-level API', () => {
    expect(typeof picasso.chart).to.equal('function');
    expect(typeof picasso.renderer).to.equal('function');
    expect(typeof picasso.config.Promise).to.equal('function');
    expect(picasso.config.Promise).to.equal(global.Promise);
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
      picasso.config.Promise = MyPromise;
    });

    afterEach(() => {
      picasso.config.Promise = global.Promise;
    });

    it('should be able to configure Promise', () => {
      expect(picasso.config.Promise).to.equal(MyPromise);
      expect(picasso.config.Promise.resolve).to.equal(MyPromise.resolve);
      expect(picasso.config.Promise.reject).to.equal(MyPromise.reject);
    });
  });

  describe('Chart lifecycle', () => {
    it('should call mounted function', () => {
      const mountedFn = sinon.sandbox.stub();
      const element = createElement();

      const chart = picasso.chart({
        mounted: mountedFn
      });
      picasso.render(element, chart);

      expect(mountedFn).to.have.been.calledWith(element);
    });

    it('should not be able to access private chart instance properties', () => {
      const element = createElement();
      const chart = picasso.chart({});
      const chartInstance = picasso.render(element, chart);
      expect(chartInstance.chart).to.be.undefined; // eslint-disable-line no-unused-expressions
      expect(chartInstance.mount).to.be.undefined; // eslint-disable-line no-unused-expressions
    });

    it('should call updated function', () => {
      const updatedFn = sinon.sandbox.stub();
      const element = createElement();

      const chart = picasso.chart({
        updated: updatedFn
      });
      const chartInstance = picasso.render(element, chart);
      chartInstance.update({
        data: {}
      });

      expect(updatedFn).to.have.been.called; // eslint-disable-line no-unused-expressions
    });

    it('should bind event listener', () => {
      const clickFn = sinon.sandbox.stub();
      const element = createElement();

      const chart = picasso.chart({
        on: {
          click: clickFn
        }
      });
      picasso.render(element, chart);

      const e = {};
      element.trigger('click', e);
      expect(clickFn).to.have.been.calledWith(e);
    });
  });
});
