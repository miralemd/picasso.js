import renderer from '../../../../src/core/renderer';

describe('fooo', () => {
  beforeEach(() => {
    renderer.register('foo', () => 'whatevz');
    renderer.register('bar', () => 'stapel');
  });
  afterEach(() => {
    renderer.types().forEach(t => renderer.deregister(t));
  });

  it('should be a function', () => {
    expect(renderer).to.be.a('function');
  });

  it('should throw error when type does not exist', () => {
    let fn = () => { renderer('dummy'); };
    expect(fn).to.throw("Renderer of type 'dummy' does not exist");
  });

  it('should create a specific type', () => {
    expect(renderer('bar')).to.equal('stapel');
  });

  it('should prioritize in registered order', () => {
    expect(renderer.prio()).to.deep.equal(['foo', 'bar']);
    expect(renderer()).to.equal('whatevz');
  });

  it('should change prio', () => {
    renderer.prio(['bar', 'foo']);
    expect(renderer.prio()).to.deep.equal(['bar', 'foo']);
    expect(renderer()).to.equal('stapel');
  });
});
