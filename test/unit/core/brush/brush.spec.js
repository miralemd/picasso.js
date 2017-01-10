import brush, { toggle, set } from '../../../../src/core/brush/brush';

describe('brush', () => {
  const noop = () => {};
  let sandbox;
  let vc;
  let vcf;
  let rc;
  let rcf;
  let b;
  before(() => {
    sandbox = sinon.sandbox.create();
    // mock value collection
    vc = () => {};
    vc.add = sandbox.stub();
    vc.values = sandbox.stub();
    vcf = () => vc;

    // mock range collection
    rc = () => {};
    rc.add = sandbox.stub();
    rc.containsValue = sandbox.stub();
    rcf = () => rc;
  });

  beforeEach(() => {
    b = brush({ vc: vcf, rc: rcf });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('api', () => {
    it('should be a factory function', () => {
      expect(brush).to.be.a('function');
    });

    it('should return a function', () => {
      expect(b).to.be.a('function');
    });
  });

  describe('events', () => {
    it('should emit a start event when started', () => {
      const cb = sandbox.spy();
      b.on('start', cb);
      b.start();
      expect(cb.callCount).to.equal(1);
    });

    it('should not emit a start event when alredy started', () => {
      const cb = sandbox.spy();
      b.on('start', cb);
      b.start();
      b.start();
      b.start();
      expect(cb.callCount).to.equal(1);
    });

    it('should emit an end event when ended', () => {
      const cb = sandbox.spy();
      b.on('end', cb);
      b.start();
      b.end();
      expect(cb.callCount).to.equal(1);
      b.end();
      expect(cb.callCount).to.equal(1);
    });

    it('should be active when started', () => {
      expect(b.isActive()).to.equal(false);
      b.start();
      expect(b.isActive()).to.equal(true);
      b.end();
      expect(b.isActive()).to.equal(false);
    });

    it('should emit an "update" event when state changes', () => {
      const cb = sandbox.spy();
      b.on('update', cb);
      vc.add.returns(true);
      b.addValue('products', 'cars');
      expect(cb).to.have.been.calledWith([{ id: 'products', values: ['cars'] }], []);
    });
  });

  describe('brushes', () => {
    it('should return all created brushes', () => {
      b.addValue('products');
      b.addRange('sales');
      expect(b.brushes()).to.eql([
        { type: 'range', id: 'sales', brush: rc },
        { type: 'value', id: 'products', brush: vc }
      ]);
    });
  });

  describe('addValue', () => {
    let v;
    let vcc;
    let bb;
    beforeEach(() => {
      v = {
        add: sandbox.stub()
      };
      vcc = sandbox.stub().returns(v);
      bb = brush({ vc: vcc, rc: noop });
    });

    it('should call value.add() with value "Car"', () => {
      bb.addValue('garage', 'Car');
      expect(vcc.callCount).to.equal(1);
      expect(v.add).to.have.been.calledWith('Car');
    });

    it('should not create more than one instance per id', () => {
      bb.addValue('garage', 'Car');
      bb.addValue('garage', 'Bike');
      expect(vcc.callCount).to.equal(1);
    });

    it('should emit "start" event if not activated', () => {
      let cb = sandbox.spy();
      bb.on('start', cb);
      v.add.returns(true);
      bb.addValue('garage', 'Car');
      bb.addValue('garage', 'Bike');
      expect(cb.callCount).to.equal(1);
    });

    it('should emit "update" event when state changes', () => {
      let cb = sandbox.spy();
      v.add.returns(true);
      bb.on('update', cb);
      bb.addValue('garage', 'Car');
      expect(cb.callCount).to.equal(1);
    });

    it('should not emit "update" event when state does not change', () => {
      let cb = sandbox.spy();
      v.add.returns(false);
      bb.on('update', cb);
      bb.addValue('garage', 'Car');
      expect(cb.callCount).to.equal(0);
    });
  });

  describe('removeValue', () => {
    let v;
    let vcc;
    let bb;
    beforeEach(() => {
      v = {
        remove: sandbox.stub(),
        add: sandbox.stub()
      };
      vcc = sandbox.stub().returns(v);
      bb = brush({ vc: vcc, rc: noop });
      bb.addValue('garage');
    });

    it('should call value.remove() with value "Car"', () => {
      bb.removeValue('garage', 'Car');
      expect(vcc.callCount).to.equal(1);
      expect(v.remove).to.have.been.calledWith('Car');
    });

    it('should emit "update" event when state changes', () => {
      let cb = sandbox.spy();
      v.remove.returns(true);
      bb.on('update', cb);
      bb.removeValue('garage', 'Car');
      expect(v.remove).to.have.been.calledWith('Car');
      expect(cb.callCount).to.equal(1);
    });

    it('should not emit "update" event when state does not change', () => {
      let cb = sandbox.spy();
      v.remove.returns(false);
      bb.on('update', cb);
      bb.removeValue('garage', 'Car');
      expect(v.remove).to.have.been.calledWith('Car');
      expect(cb.callCount).to.equal(0);
    });
  });

  describe('addRange', () => {
    let v;
    let rcc;
    let bb;
    beforeEach(() => {
      v = {
        add: sandbox.stub()
      };
      rcc = sandbox.stub().returns(v);
      bb = brush({ rc: rcc, vc: noop });
    });

    it('should call range.add() with { min: 3 max: 7 }', () => {
      bb.addRange('speed', { min: 3, max: 7 });
      expect(rcc.callCount).to.equal(1);
      expect(v.add).to.have.been.calledWith({ min: 3, max: 7 });
    });

    it('should not create more than one instance per id', () => {
      bb.addRange('speed', {});
      bb.addRange('speed', {});
      expect(rcc.callCount).to.equal(1);
    });

    it('should emit "start" event if not activated', () => {
      let cb = sandbox.spy();
      bb.on('start', cb);
      bb.addRange('speed', {});
      bb.addRange('speed', {});
      expect(cb.callCount).to.equal(1);
    });

    it('should emit "update" event', () => {
      let cb = sandbox.spy();
      bb.on('update', cb);
      bb.addRange('speed', {});
      expect(cb.callCount).to.equal(1);
    });
  });

  describe('containsValue', () => {
    let v;
    let vcc;
    let bb;
    beforeEach(() => {
      v = {
        add: sandbox.stub(),
        contains: sandbox.stub()
      };
      vcc = sandbox.stub().returns(v);
      bb = brush({ vc: vcc, rc: noop });
    });

    it('should return false when given id does not exist in the brush context', () => {
      expect(bb.containsValue('garage', 3)).to.equal(false);
    });

    it('should return true when given value exists', () => {
      bb.addValue('garage');
      v.contains.returns(true);
      expect(bb.containsValue('garage', 3)).to.equal(true);
      expect(v.contains).to.have.been.calledWith(3);
    });

    it('should return false when given value does not exist', () => {
      bb.addValue('garage');
      v.contains.returns(false);
      expect(bb.containsValue('garage', 3)).to.equal(false);
      expect(v.contains).to.have.been.calledWith(3);
    });
  });

  describe('containsRangeValue', () => {
    let v;
    let rcc;
    let bb;
    beforeEach(() => {
      v = {
        add: sandbox.stub(),
        containsValue: sandbox.stub()
      };
      rcc = sandbox.stub().returns(v);
      bb = brush({ vc: noop, rc: rcc });
    });

    it('should return false when given id does not exist in the brush context', () => {
      expect(bb.containsRangeValue('speed')).to.equal(false);
    });

    it('should return true when given value exists', () => {
      bb.addRange('speed');
      v.containsValue.returns(true);
      expect(bb.containsRangeValue('speed', 'some range')).to.equal(true);
      expect(v.containsValue).to.have.been.calledWith('some range');
    });

    it('should return false when given value does not exist', () => {
      bb.addRange('speed');
      v.containsValue.returns(false);
      expect(bb.containsRangeValue('speed', 'very fast')).to.equal(false);
      expect(v.containsValue).to.have.been.calledWith('very fast');
    });
  });

  describe('clear', () => {
    it('should not emit an "update" event when state has not changed', () => {
      const cb = sandbox.spy();
      b.on('update', cb);
      b.clear();
      expect(cb.callCount).to.equal(0);
    });

    it('should emit an "update" event when state changed', () => {
      const cb = sandbox.spy();
      b.addValue('products', 'whatevz');
      b.on('update', cb);
      b.clear();
      expect(cb.callCount).to.equal(1);
    });
  });

  describe('containsData', () => {
    let v;
    let rcc;
    let bb;
    let d;

    let val;
    let vcc;

    beforeEach(() => {
      v = {
        add: sandbox.stub(),
        containsValue: sandbox.stub()
      };
      val = {
        add: sandbox.stub(),
        contains: sandbox.stub()
      };
      rcc = sandbox.stub().returns(v);
      vcc = sandbox.stub().returns(val);
      bb = brush({ vc: vcc, rc: rcc });
      d = {
        x: { value: 7, source: { field: 'sales', type: 'quant' } },
        self: { value: 'Cars', source: { field: 'products' } }
      };
    });

    it('should return true when data contains a brushed range', () => {
      bb.addRange('sales');
      v.containsValue.returns(true);
      expect(bb.containsMappedData(d)).to.equal(true);
      expect(v.containsValue).to.have.been.calledWith(7);
    });

    it('should return true when data contains a brushed value', () => {
      bb.addValue('products');
      val.contains.returns(true);
      expect(bb.containsMappedData(d)).to.equal(true);
      expect(val.contains).to.have.been.calledWith('Cars');
    });

    it('should return false when data has no source', () => {
      bb.addRange('sales');
      v.containsValue.returns(true);
      expect(bb.containsMappedData({
        x: { value: 7 }
      })).to.equal(false);
      expect(v.containsValue.callCount).to.equal(0);
    });

    it('should return false when brushed data is not part of property filter', () => {
      bb.addValue('products');
      val.contains.returns(true);
      expect(bb.containsMappedData(d, ['nope'])).to.equal(false);
      expect(val.contains).to.have.been.calledWith('Cars');
    });
  });

  describe('toggle', () => {
    let v;
    let vcoll;

    beforeEach(() => {
      v = {
        add: sandbox.stub(),
        remove: sandbox.stub(),
        contains: sandbox.stub()
      };
      vcoll = sandbox.stub().returns(v);
    });

    it('should not toggle duplicate values', () => {
      let items = [
        { key: 'products', value: 'Bike' },
        { key: 'regions', value: 'south' },
        { key: 'regions', value: 'south' },
        { key: 'products', value: 'Bike' },
        { key: 'products', value: 'Bike' },
        { key: 'products', value: 'Bike' }
      ];
      let toggled = toggle({
        items,
        vc: vcoll,
        values: {}
      });

      expect(toggled).to.eql([[], []]);
    });

    it('should toggle on new values', () => {
      let items = [
        { key: 'products', value: 'Bike' },
        { key: 'products', value: 0 }
      ];
      let toggled = toggle({
        items,
        vc: vcoll,
        values: {}
      });

      let expectAdded = [
        { id: 'products', values: ['Bike', 0] }
      ];
      expect(toggled[0]).to.eql(expectAdded);
    });

    it('should toggle off existing values', () => {
      let items = [
        { key: 'products', value: 'Bike' },
        { key: 'products', value: 'Existing' },
        { key: 'products', value: 'Car' }
      ];
      v.contains.withArgs('Existing').returns(true);
      let toggled = toggle({
        items,
        vc: vcoll,
        values: {}
      });

      let expectRemoved = [
        { id: 'products', values: ['Existing'] }
      ];
      expect(toggled[1]).to.eql(expectRemoved);
    });
  });

  describe('set', () => {
    let v;
    let vcoll;

    beforeEach(() => {
      v = {
        add: sandbox.stub(),
        remove: sandbox.stub(),
        contains: sandbox.stub(),
        values: sandbox.stub()
      };
      vcoll = sandbox.stub().returns(v);
    });

    it('should add the new values', () => {
      let items = [
        { key: 'products', value: 'Bike' }
      ];
      let changed = set({
        items,
        vc: vcoll,
        vCollection: {}
      });

      expect(changed[0]).to.eql([{ id: 'products', values: ['Bike'] }]);
    });

    it('should not add existing values', () => {
      v.values.returns(['Bike']); // existing values
      let items = [
        { key: 'products', value: 'Bike' } // new values
      ];
      v.contains.withArgs('Bike').returns(true);
      let changed = set({
        items,
        vc: vcoll,
        vCollection: {
          products: v
        }
      });

      expect(changed[0]).to.eql([]);
    });

    it('should not remove existing values', () => {
      v.values.returns(['Bike']); // existing values
      let items = [
        { key: 'products', value: 'Bike' } // new values
      ];
      v.contains.withArgs('Bike').returns(true);
      let changed = set({
        items,
        vc: vcoll,
        vCollection: {
          products: v
        }
      });

      expect(changed[1]).to.eql([]);
    });

    it('should remove old values from same collection', () => {
      v.values.returns([0, 'Cars', 'Skateboards']); // existing values
      let items = [
        { key: 'products', value: 'Bike' }, // new value
        { key: 'products', value: 'Skateboards' } // add existing value
      ];
      v.contains.withArgs('Cars').returns(true);
      v.contains.withArgs(0).returns(true);
      let changed = set({
        items,
        vc: vcoll,
        vCollection: {
          products: v
        }
      });

      expect(changed[1]).to.eql([{ id: 'products', values: [0, 'Cars'] }]);
    });

    it('should remove old values', () => {
      v.values.returns(['Cars', 'Skateboards']); // existing values
      let items = [];
      let changed = set({
        items,
        vc: vcoll,
        vCollection: {
          products: v
        }
      });

      expect(changed[1]).to.eql([{ id: 'products', values: ['Cars', 'Skateboards'] }]);
    });
  });
});
