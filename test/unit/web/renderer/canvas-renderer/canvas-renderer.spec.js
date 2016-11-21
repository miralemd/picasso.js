import { renderer } from '../../../../../src/web/renderer/canvas-renderer';
import config from '../../../../../src/config';
import element from '../../../../mocks/element-mock';

describe('canvas renderer', () => {
  let sandbox,
    r,
    scene;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    config.Promise = {
      resolve: sandbox.stub(),
      reject: sandbox.stub()
    };
    scene = sandbox.stub();
    r = renderer(scene);
  });

  afterEach(() => {
    config.Promise = global.Promise;
    sandbox.restore();
  });

  it('should append canvas element', () => {
    const div = element('div');
    const spy = sandbox.spy(div, 'appendChild');
    r.appendTo(div);
    expect(spy.args[0][0].name).to.equal('canvas');
  });

  it('should return rejected promise when no canvas is initiated', () => {
    r.render();
    expect(config.Promise.reject.callCount).to.equal(1);
  });

  it('should return resolved promise when canvas exists', () => {
    r.appendTo(element('div'));
    scene.returns({ children: [] });
    r.render();
    expect(config.Promise.resolve.callCount).to.equal(1);
  });

  it('should return zero size when canvas is not initiated', () => {
    expect(r.size()).to.deep.equal({ x: 0, y: 0, width: 0, height: 0 });
  });

  it('should return size when called', () => {
    r.size({ x: 50, y: 100, width: 200, height: 400 });
    expect(r.size()).to.deep.equal({ x: 50, y: 100, width: 200, height: 400 });
  });

  it('should attach to given position in the container', () => {
    scene.returns({ children: [] });
    r.appendTo(element('div'));
    r.size({ x: 50, y: 100, width: 200, height: 400 });
    r.render();

    const el = r.element();
    expect(el.style.position).to.equal('absolute');
    expect(el.style.left).to.equal('50px');
    expect(el.style.top).to.equal('100px');
    expect(el.style.width).to.equal('200px');
    expect(el.style.height).to.equal('400px');
    expect(el.width).to.equal(200);
    expect(el.height).to.equal(400);
  });

  it('should detach from parent element when destoyed', () => {
    const div = element('div');
    r.appendTo(div);
    expect(div.children.length).to.equal(1);
    r.destroy();
    expect(div.children.length).to.equal(0);
  });

  it('should scale canvas to adjust for HiDPI screens', () => {
    const div = element('div');
    const inputShapes = [{ type: 'container' }];
    const expectedInputShapes = [
      {
        type: 'container',
        children: inputShapes,
        transform: 'scale(0.5, 0.5)'
      }
    ];
    scene.returns({ children: [] });
    r.appendTo(div);
    r.size({ x: 50, y: 100, width: 200, height: 400 });

    const ctxStub = sandbox.stub(div.children[0], 'getContext');
    ctxStub.returns({ webkitBackingStorePixelRatio: 2 });

    r.render(inputShapes);

    expect(r.element().style.width).to.equal('200px');
    expect(r.element().style.height).to.equal('400px');
    expect(r.element().width).to.equal(200 * (1 / 2));
    expect(r.element().height).to.equal(400 * (1 / 2));
    expect(scene.args[0][0]).to.deep.equal(expectedInputShapes);
  });
});
