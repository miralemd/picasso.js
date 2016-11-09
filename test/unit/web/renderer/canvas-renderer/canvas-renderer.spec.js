import { renderer } from '../../../../../src/web/renderer/canvas-renderer';
import element from '../../../../mocks/element-mock';

describe('canvas renderer', () => {
  let sandbox,
    r,
    Prom,
    scene;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    Prom = {
      resolve: sandbox.stub(),
      reject: sandbox.stub()
    };
    scene = sandbox.stub();
    r = renderer(scene, Prom);
  });

  afterEach(() => {
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
    expect(Prom.reject.callCount).to.equal(1);
  });

  it('should return resolved promise when canvas exists', () => {
    r.appendTo(element('div'));
    scene.returns({ children: [] });
    r.render();
    expect(Prom.resolve.callCount).to.equal(1);
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
});
