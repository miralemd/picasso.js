import * as picasso from '../../src/index';
import createElement from '../mocks/element-mock';

describe('picasso.js', () => {
  it('should expose the correct top-level API', () => {
    expect(typeof picasso.chart).to.equal('function');
    expect(typeof picasso.renderer).to.equal('function');
  });

  describe('Chart lifecycle', () => {
    it('should call mounted function', () => {
      const mountedFn = sinon.sandbox.stub();
      const element = createElement();

      picasso.chart({
        element,
        mounted: mountedFn
      });

      expect(mountedFn).to.have.been.calledWith(element);
    });

    it('should expose the element', () => {
      const element = createElement();
      const chart = picasso.chart({ element });
      expect(chart.element).to.equal(element);
    });

    it('should call updated function', () => {
      const updatedFn = sinon.sandbox.stub();
      const element = createElement();

      const chart = picasso.chart({
        element,
        updated: updatedFn
      });
      chart.update({
        data: {}
      });

      expect(updatedFn).to.have.been.called;
    });

    it('should bind event listener', () => {
      const clickFn = sinon.sandbox.stub();
      const element = createElement();

      picasso.chart({
        element,
        on: {
          click: clickFn
        }
      });

      const e = {};
      element.trigger('click', e);
      expect(clickFn).to.have.been.calledWith(e);
    });

    it('should bind brush event listeners', () => {
      const element = createElement();
      const spy = sinon.spy(element, 'addEventListener');
      const matchFn = fnName => value => value.toString().indexOf(fnName) !== -1;

      picasso.chart({
        element
      });

      expect(spy).to.have.been.calledWith('mousedown', sinon.match(matchFn('onTapDown'), 'function onTapDown'));
      expect(spy).to.have.been.calledWith('mouseup', sinon.match(matchFn('onBrushTap'), 'function onBrushTap'));
      expect(spy).to.have.been.calledWith('mousemove', sinon.match(matchFn('onBrushOver'), 'function onBrushOver'));
    });
  });
});
