import {
  reducers,
  collectRepeating,
  collectMapping,
  collectValues,
  mapData
} from '../../../../src/core/data/data-mapper';

describe('data-mapper', () => {
  describe('reducers', () => {
    describe('defaults', () => {
      const values = [2, -1, 4, 3];
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

    describe('containing valid and null data', () => {
      const values = [undefined, 2, -1, null, 4, NaN, '', 3];
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

    describe('containing only null data', () => {
      const values = [undefined, null, NaN, ''];
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

  describe('collectRepeating', () => {
    let ds;
    let sandbox;
    let values;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      ds = {
        findField: sandbox.stub()
      };
      values = [
        { value: 7, id: 'id:7', label: 'seven', index: 7 },
        { value: 2, id: 'id:2', label: 'two', index: 8 },
        { value: 7, id: 'id:7', label: 'seven', index: 9 },
        { value: 11, id: 'id:11', label: 'eleven', index: 10 }
      ];
    });

    it('should collect values by id', () => {
      ds.findField.returns({
        field: {
          values: () => values
        }
      });
      const collected = collectRepeating({
        source: ''
      }, ds);
      expect(collected).to.eql({
        collection: [{}, {}, {}],
        fieldValues: values,
        trackBy: 'id',
        others: undefined,
        ids: {
          'id:7': {},
          'id:2': {},
          'id:11': {}
        }
      });
    });

    it('should collect values by index', () => {
      ds.findField.returns({
        field: {
          values: () => values
        }
      });
      const collected = collectRepeating({
        source: '',
        trackBy: '$index'
      }, ds);
      expect(collected).to.eql({
        collection: [{}, {}, {}, {}],
        fieldValues: values,
        trackBy: '$index',
        others: undefined,
        ids: {
          0: {},
          1: {},
          2: {},
          3: {}
        }
      });
    });

    it('should create an others group when repeater is not defined', () => {
      ds.findField.returns({
        field: {
          values: () => values
        }
      });
      const collected = collectRepeating(undefined, ds);
      expect(collected).to.eql({
        collection: [{}],
        fieldValues: [],
        trackBy: 'id',
        others: {},
        ids: {}
      });
    });
  });

  describe('collectValues', () => {
    it('should collect values by index', () => {
      const pool = { 0: {}, 1: {} };

      collectValues({
        key: 'x',
        pool,
        values: [{ val: 'a' }, { val: 'c' }],
        syncValues: [true, true],
        type: 'qual',
        trackBy: '$index',
        source: 'data source',
        valueProperty: 'val'
      });

      expect(pool).to.eql({
        0: { x: { _values: ['a'], source: { field: 'data source', type: 'qual', indices: [0] } } },
        1: { x: { _values: ['c'], source: { field: 'data source', type: 'qual', indices: [1] } } }
      });
    });

    it('should collect values by index and extract index value', () => {
      const pool = { 0: {}, 1: {} };

      collectValues({
        key: 'x',
        pool,
        values: [{ val: 'a', index: 13 }, { val: 'c', index: 15 }],
        syncValues: [true, true],
        type: 'qual',
        trackBy: '$index',
        source: 'data source',
        valueProperty: '$index'
      });

      expect(pool).to.eql({
        0: { x: { _values: [13], source: { field: 'data source', type: 'qual', indices: [0] } } },
        1: { x: { _values: [15], source: { field: 'data source', type: 'qual', indices: [1] } } }
      });
    });

    it('should collect values by attribute', () => {
      const pool = {
        volvo: {},
        mercedes: {},
        bmw: {
          brand: {
            _values: ['existing'],
            source: {
              field: 'car data',
              type: 'typiskt',
              indices: [13]
            }
          }
        }
      };

      collectValues({
        key: 'brand',
        pool,
        values: [{ val: 'a' }, { val: 'c' }, { val: 'b' }, { val: 'c' }, { val: 'e' }, { val: 'd' }],
        syncValues: [{ car: 'bmw' }, { car: 'volvo' }, { car: 'mercedes' }, { car: 'volvo' }, { car: 'bmw' }, { car: 'mercedes' }],
        type: 'qual',
        trackBy: 'car',
        source: 'data source',
        valueProperty: 'val'
      });

      expect(pool).to.eql({
        volvo: { brand: { _values: ['c', 'c'], source: { field: 'data source', type: 'qual', indices: [1, 3] } } },
        bmw: { brand: { _values: ['existing', 'a', 'e'], source: { field: 'car data', type: 'typiskt', indices: [13, 0, 4] } } },
        mercedes: { brand: { _values: ['b', 'd'], source: { field: 'data source', type: 'qual', indices: [2, 5] } } }
      });
    });

    it('should skip values that are not in the pool', () => {
      const pool = {
        volvo: {}
      };

      collectValues({
        key: 'brand',
        pool,
        values: [{ val: 'a' }, { val: 'c' }, { val: 'b' }, { val: 'c' }, { val: 'e' }, { val: 'd' }],
        syncValues: [{ car: 'bmw' }, { car: 'volvo' }, { car: 'mercedes' }, { car: 'volvo' }, { car: 'bmw' }, { car: 'mercedes' }],
        type: 'qual',
        trackBy: 'car',
        source: 'data source',
        valueProperty: 'val'
      });

      expect(pool).to.eql({
        volvo: { brand: { _values: ['c', 'c'], source: { field: 'data source', type: 'qual', indices: [1, 3] } } }
      });
    });

    it('should collect values into the others bin when there is no sync match', () => {
      const others = {};

      collectValues({
        key: 'brand',
        values: [{ val: 'a' }, { val: 'c' }, { val: 'b' }],
        syncValues: [],
        type: 'qual',
        source: 'data source',
        valueProperty: 'val',
        others
      });

      expect(others).to.eql({
        brand: { _values: ['a', 'c', 'b'], source: { field: 'data source', type: 'qual', indices: [0, 1, 2] } }
      });
    });
  });

  describe('collectMapping', () => {
    let ds;
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      ds = {
        findField: sandbox.stub()
      };
    });

    it('should call collector with proper arguments', () => {
      const groups = {
        collection: [{}, {}, {}],
        ids: 'idMap',
        trackBy: 'id',
        fieldValues: 'syncValues',
        others: 'others'
      };
      const mapping = { source: 'dummy' };
      ds.findField.returns({
        field: {
          values: () => 'dummyValues',
          type: () => 'dimension'
        }
      });
      const collector = sandbox.stub();
      collectMapping('x', mapping, groups, ds, collector);

      expect(collector).to.have.been.calledWith({
        key: 'x',
        pool: 'idMap',
        values: 'dummyValues',
        syncValues: 'syncValues',
        type: 'qual',
        trackBy: 'id',
        valueProperty: 'label',
        source: 'dummy',
        others: 'others'
      });
    });

    it('should call collector with proper arguments, again', () => {
      const groups = {
        collection: [{}, {}, {}],
        ids: 'idMap',
        trackBy: 'id',
        fieldValues: 'syncValues',
        others: 'others'
      };
      const mapping = {
        source: 'dummy',
        linkFrom: 'linkedField'
      };
      ds.findField.onCall(0).returns({
        field: {
          values: () => 'dummyValues',
          type: () => 'measure'
        }
      });
      ds.findField.onCall(1).returns({
        field: {
          values: () => 'customSyncValues'
        }
      });
      const collector = sandbox.stub();
      collectMapping('x', mapping, groups, ds, collector);

      expect(collector).to.have.been.calledWith({
        key: 'x',
        pool: 'idMap',
        values: 'dummyValues',
        syncValues: 'customSyncValues',
        type: 'quant',
        trackBy: 'id',
        source: 'dummy',
        valueProperty: 'value',
        others: 'others'
      });
    });
  });

  describe('map', () => {
    let ds;
    let sandbox;
    const productGroup = [
      { value: 'NaN', label: 'Cars', id: 0 },
      { value: 'NaN', label: 'Cars', id: 0 },
      { value: 'NaN', label: 'Bikes', id: 1 },
      { value: 'NaN', label: 'Shoes', id: 2 },
      { value: 'NaN', label: 'Shoes', id: 2 }
    ];
    const product = [
      { value: 'NaN', label: 'BMW', id: 0 },
      { value: 'NaN', label: 'Mercedes', id: 1 },
      { value: 'NaN', label: 'Racers', id: 2 },
      { value: 'NaN', label: 'Sneakers', id: 3 },
      { value: 'NaN', label: 'Boots', id: 4 }
    ];
    const year = [
      { value: '2012', label: '2012', id: 0 },
      { value: '2013', label: '2013', id: 1 },
      { value: '2014', label: '2014', id: 2 },
      { value: '2014', label: '2014', id: 3 },
      { value: '2012', label: '2012', id: 4 }
    ];
    const sales = [
      { value: 56, label: '$56', id: 0 },
      { value: 59, label: '$59', id: 0 },
      { value: 30, label: '$30', id: 0 },
      { value: 70, label: '$70', id: 0 },
      { value: 0, label: '$0', id: 0 }
    ];
    const margin = [
      { value: -2, label: '-2', id: 0 },
      { value: -3, label: '-3', id: 0 },
      { value: 0.4, label: '0.4', id: 0 },
      { value: 0.5, label: '0.5', id: 0 },
      { value: -0.4, label: '-0.4', id: 0 }
    ];
    const color = [
      { value: '#f00', label: 'red', id: 0 },
      { value: '#00f', label: 'blue', id: 1 },
      { value: '#0f0', label: 'green', id: 2 }
    ];
    const colorToProductGroupLink = [
      { value: 'NaN', label: 'Cars', id: 0 },
      { value: 'NaN', label: 'Bikes', id: 1 },
      { value: 'NaN', label: 'Shoes', id: 2 }
    ];
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      ds = {
        findField: sandbox.stub()
      };

      ds.findField.withArgs('/0/0').returns({
        field: {
          values: () => productGroup,
          type: () => 'dimension'
        }
      });

      ds.findField.withArgs('/0/1').returns({
        field: {
          values: () => product,
          type: () => 'dimension'
        }
      });

      ds.findField.withArgs('/0/2').returns({
        field: {
          values: () => year,
          type: () => 'dimension'
        }
      });

      ds.findField.withArgs('/0/3').returns({
        field: {
          values: () => sales,
          type: () => 'measure'
        }
      });

      ds.findField.withArgs('/0/4').returns({
        field: {
          values: () => margin,
          type: () => 'measure'
        }
      });

      ds.findField.withArgs('/1/1').returns({
        field: {
          values: () => color,
          type: () => 'dimension'
        }
      });

      ds.findField.withArgs('/1/0').returns({
        field: {
          values: () => colorToProductGroupLink
        }
      });
    });

    it('should collect itself', () => {
      const groupBy = {
        source: '/0/0'
      };

      const values = mapData({}, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0, 1], type: 'qual' }, _values: ['Cars', 'Cars'] }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3, 4], type: 'qual' }, _values: ['Shoes', 'Shoes'] }
        }
      ]);
    });

    it('should collect all into one bin when repeater is undefined', () => {
      const mapper = {
        sales: { source: '/0/3', reducer: 'sum' }
      };
      const values = mapData(mapper, undefined, ds);
      expect(values).to.eql([
        {
          sales: { value: 215, source: { field: '/0/3', indices: [0, 1, 2, 3, 4], type: 'quant' }, _values: [56, 59, 30, 70, 0] }
        }
      ]);
    });

    it('should collect data by rows', () => {
      const groupBy = {
        source: '/0/0', trackBy: '$index'
      };
      const mapper = {
        sales: { source: '/0/3', reducer: 'sum' },
        margin: { source: '/0/4', reducer: 'first' }
      };

      const values = mapData(mapper, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0], type: 'qual' }, _values: ['Cars'] },
          sales: { value: 56, source: { field: '/0/3', indices: [0], type: 'quant' }, _values: [56] },
          margin: { value: -2, source: { field: '/0/4', indices: [0], type: 'quant' }, _values: [-2] }
        },
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [1], type: 'qual' }, _values: ['Cars'] },
          sales: { value: 59, source: { field: '/0/3', indices: [1], type: 'quant' }, _values: [59] },
          margin: { value: -3, source: { field: '/0/4', indices: [1], type: 'quant' }, _values: [-3] }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] },
          sales: { value: 30, source: { field: '/0/3', indices: [2], type: 'quant' }, _values: [30] },
          margin: { value: 0.4, source: { field: '/0/4', indices: [2], type: 'quant' }, _values: [0.4] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3], type: 'qual' }, _values: ['Shoes'] },
          sales: { value: 70, source: { field: '/0/3', indices: [3], type: 'quant' }, _values: [70] },
          margin: { value: 0.5, source: { field: '/0/4', indices: [3], type: 'quant' }, _values: [0.5] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [4], type: 'qual' }, _values: ['Shoes'] },
          sales: { value: 0, source: { field: '/0/3', indices: [4], type: 'quant' }, _values: [0] },
          margin: { value: -0.4, source: { field: '/0/4', indices: [4], type: 'quant' }, _values: [-0.4] }
        }
      ]);
    });

    it('should collect data by group', () => {
      const groupBy = {
        source: '/0/0'
      };
      const mapper = {
        sales: { source: '/0/3', reducer: 'sum' },
        margin: { source: '/0/4', reducer: 'first' }
      };

      const values = mapData(mapper, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0, 1], type: 'qual' }, _values: ['Cars', 'Cars'] },
          sales: { value: 115, source: { field: '/0/3', indices: [0, 1], type: 'quant' }, _values: [56, 59] },
          margin: { value: -2, source: { field: '/0/4', indices: [0, 1], type: 'quant' }, _values: [-2, -3] }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] },
          sales: { value: 30, source: { field: '/0/3', indices: [2], type: 'quant' }, _values: [30] },
          margin: { value: 0.4, source: { field: '/0/4', indices: [2], type: 'quant' }, _values: [0.4] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3, 4], type: 'qual' }, _values: ['Shoes', 'Shoes'] },
          sales: { value: 70, source: { field: '/0/3', indices: [3, 4], type: 'quant' }, _values: [70, 0] },
          margin: { value: 0.5, source: { field: '/0/4', indices: [3, 4], type: 'quant' }, _values: [0.5, -0.4] }
        }
      ]);
    });

    it('should collect data from multiple tables', () => {
      const groupBy = {
        source: '/0/0'
      };
      const mapper = {
        color: { source: '/1/1', reducer: 'first', linkFrom: '/1/0' }
      };

      const values = mapData(mapper, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0, 1], type: 'qual' }, _values: ['Cars', 'Cars'] },
          color: { value: 'red', source: { field: '/1/1', indices: [0], type: 'qual' }, _values: ['red'] }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] },
          color: { value: 'blue', source: { field: '/1/1', indices: [1], type: 'qual' }, _values: ['blue'] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3, 4], type: 'qual' }, _values: ['Shoes', 'Shoes'] },
          color: { value: 'green', source: { field: '/1/1', indices: [2], type: 'qual' }, _values: ['green'] }
        }
      ]);
    });

    it('should collect data using a custom reducer function', () => {
      const groupBy = {
        source: '/0/0'
      };
      const reducer = values => values.map(v => v).join(', ');
      const mapper = {
        year: { source: '/0/2', type: 'quant', reducer }
      };

      const values = mapData(mapper, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0, 1], type: 'qual' }, _values: ['Cars', 'Cars'] },
          year: { value: '2012, 2013', source: { field: '/0/2', indices: [0, 1], type: 'quant' }, _values: ['2012', '2013'] }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] },
          year: { value: '2014', source: { field: '/0/2', indices: [2], type: 'quant' }, _values: ['2014'] }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3, 4], type: 'qual' }, _values: ['Shoes', 'Shoes'] },
          year: { value: '2014, 2012', source: { field: '/0/2', indices: [3, 4], type: 'quant' }, _values: ['2014', '2012'] }
        }
      ]);
    });

    it('should accept constant values', () => {
      const groupBy = {
        source: '/0/0'
      };
      const mapper = {
        num: 3,
        s: 'foo',
        b: false
      };
      const values = mapData(mapper, groupBy, ds);
      expect(values).to.eql([
        {
          self: { value: 'Cars', source: { field: '/0/0', indices: [0, 1], type: 'qual' }, _values: ['Cars', 'Cars'] },
          num: { value: 3 },
          s: { value: 'foo' },
          b: { value: false }
        },
        {
          self: { value: 'Bikes', source: { field: '/0/0', indices: [2], type: 'qual' }, _values: ['Bikes'] },
          num: { value: 3 },
          s: { value: 'foo' },
          b: { value: false }
        },
        {
          self: { value: 'Shoes', source: { field: '/0/0', indices: [3, 4], type: 'qual' }, _values: ['Shoes', 'Shoes'] },
          num: { value: 3 },
          s: { value: 'foo' },
          b: { value: false }
        }
      ]);
    });
  });
});
