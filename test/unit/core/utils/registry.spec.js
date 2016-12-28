import Registry, { registry } from '../../../../src/core/utils/registry';

describe('Registry', () => {
  let reg;
  beforeEach(() => {
    reg = new Registry();
  });

  describe('registry', () => {
    it('should instantiate a new registry', () => {
      expect(registry()).to.be.an.instanceof(Registry);
    });
  });

  describe('register', () => {
    it('should register a function', () => {
      const fn = () => {};
      const registered = reg.register('foo', fn);
      expect(reg.registry.foo).to.equal(fn);
      expect(registered).to.equal(true);
    });
    it('should throw error if key is invalid', () => {
      let fn = () => {
          reg.register('');
        },
        fn2 = () => {
          reg.register(5);
        };

      expect(fn).to.throw('Invalid key');
      expect(fn2).to.throw('Invalid key');
    });
    it('should not register if key is taken', () => {
      reg.register('a', () => {});
      const registered = reg.register('a', () => {});
      expect(registered).to.equal(false);
    });
  });

  describe('build', () => {
    let sandbox,
      fn;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      fn = sandbox.stub().returns('something');
      reg.register('foo', fn);
    });
    it('should build', () => {
      let obj = {
          type: 'yes'
        },
        b = reg.build({
          useless: {},
          foo: obj
        });

      expect(fn).to.have.been.calledWith(obj);
      expect(b.foo).to.equal('something');
    });
  });
});
