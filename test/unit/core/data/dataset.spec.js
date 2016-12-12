import dataset from '../../../../src/core/data/dataset';

describe('dataset', () => {
  const arr = [
    { name: 'cube', data: {} },
    { name: 'othercube', data: {} }
  ];

  const tablesFn = function (data) {
    return data.map(t => t.name);
  };

  describe('api', () => {
    let d;
    before(() => {
      d = dataset();
    });
    it('should be a function', () => {
      expect(d).to.be.a('function');
    });

    it('#tables', () => {
      expect(d.tables).to.be.a('function');
    });
  });

  describe('map', () => {
    let ds;
    before(() => {
      let data = [
        [
          ['Product Group', 'Product', 'Year', 'Sales', 'Margin'],
          ['Cars', 'BMW', 2012, 56, -2],
          ['Cars', 'Mercedes', 2013, 59, -3],
          ['Bikes', 'Racers', 2014, 30, 0.4],
          ['Shoes', 'Sneakers', 2014, 70, 0.5],
          ['Shoes', 'Boots', 2012, 0, -0.4]
        ],
        [
          ['Product Group', 'Color'],
          ['Cars', 'red'],
          ['Bikes', 'blue'],
          ['Shoes', 'green']
        ]
      ];
      ds = dataset()(data);
    });

    it('should collect data by rows', () => {
      let groupBy = {
        field: '/0/0', attribute: '$index'
      };
      let mapper = {
        sales: { field: '/0/3', reducer: 'sum' },
        margin: { field: '/0/4', reducer: 'first' }
      };

      let values = ds.map(mapper, groupBy);
      expect(values).to.eql([
        {
          sales: { value: 56, source: { field: '/0/3', indices: [0] } },
          margin: { value: -2, source: { field: '/0/4', indices: [0] } }
        },
        {
          sales: { value: 59, source: { field: '/0/3', indices: [1] } },
          margin: { value: -3, source: { field: '/0/4', indices: [1] } }
        },
        {
          sales: { value: 30, source: { field: '/0/3', indices: [2] } },
          margin: { value: 0.4, source: { field: '/0/4', indices: [2] } }
        },
        {
          sales: { value: 70, source: { field: '/0/3', indices: [3] } },
          margin: { value: 0.5, source: { field: '/0/4', indices: [3] } }
        },
        {
          sales: { value: 0, source: { field: '/0/3', indices: [4] } },
          margin: { value: -0.4, source: { field: '/0/4', indices: [4] } }
        }
      ]);
    });

    it('should collect data by group', () => {
      let groupBy = {
        field: '/0/0'
      };
      let mapper = {
        sales: { field: '/0/3', reducer: 'sum' },
        margin: { field: '/0/4', reducer: 'first' }
      };

      let values = ds.map(mapper, groupBy);
      expect(values).to.eql([
        {
          sales: { value: 115, source: { field: '/0/3', indices: [0, 1] } },
          margin: { value: -2, source: { field: '/0/4', indices: [0, 1] } }
        },
        {
          sales: { value: 30, source: { field: '/0/3', indices: [2] } },
          margin: { value: 0.4, source: { field: '/0/4', indices: [2] } }
        },
        {
          sales: { value: 70, source: { field: '/0/3', indices: [3, 4] } },
          margin: { value: 0.5, source: { field: '/0/4', indices: [3, 4] } }
        }
      ]);
    });

    it('should collect data without group', () => {
      let mapper = {
        sales: { field: '/0/3', reducer: 'sum' },
        margin: { field: '/0/4', reducer: 'first' }
      };

      let values = ds.map(mapper);
      expect(values).to.eql({
        sales: { value: 215, source: { field: '/0/3', indices: [0, 1, 2, 3, 4] } },
        margin: { value: -2, source: { field: '/0/4', indices: [0, 1, 2, 3, 4] } }
      });
    });

    it('should collect data from multiple tables', () => {
      let groupBy = {
        field: '/0/0'
      };
      let mapper = {
        sales: { field: '/0/3', reducer: 'sum' },
        margin: { field: '/0/4', reducer: 'first' },
        color: { field: '/1/1', reducer: 'first', linkFrom: '/1/0' }
      };

      let values = ds.map(mapper, groupBy);
      expect(values).to.eql([
        {
          sales: { value: 115, source: { field: '/0/3', indices: [0, 1] } },
          margin: { value: -2, source: { field: '/0/4', indices: [0, 1] } },
          color: { value: 'red', source: { field: '/1/1', indices: [0] } }
        },
        {
          sales: { value: 30, source: { field: '/0/3', indices: [2] } },
          margin: { value: 0.4, source: { field: '/0/4', indices: [2] } },
          color: { value: 'blue', source: { field: '/1/1', indices: [1] } }
        },
        {
          sales: { value: 70, source: { field: '/0/3', indices: [3, 4] } },
          margin: { value: 0.5, source: { field: '/0/4', indices: [3, 4] } },
          color: { value: 'green', source: { field: '/1/1', indices: [2] } }
        }
      ]);
    });

    it('should collect data using a custom reducer function', () => {
      let groupBy = {
        field: '/0/0'
      };
      let reducer = values => values.map(v => v).join(', ');
      let mapper = {
        year: { field: '/0/2', reducer }
      };

      let values = ds.map(mapper, groupBy);
      expect(values).to.eql([
        {
          year: { value: '2012, 2013', source: { field: '/0/2', indices: [0, 1] } }
        },
        {
          year: { value: '2014', source: { field: '/0/2', indices: [2] } }
        },
        {
          year: { value: '2014, 2012', source: { field: '/0/2', indices: [3, 4] } }
        }
      ]);
    });
  });

  describe('findField', () => {
    let ds;
    before(() => {
      let data = [
        [
          []
        ],
        [
          ['Product', 'Sales'],
          ['Cars', 56],
          ['Cars', 59]
        ]
      ];
      ds = dataset()(data);
    });

    it('should find the second field in the second table', () => {
      let f = ds.findField('/1/1');
      expect(f.table.id()).to.equal('/1');
      expect(f.field.id()).to.equal('/1');
      expect(f.field.values()).to.eql([
        { value: 56, label: '56', id: '56' },
        { value: 59, label: '59', id: '59' }
      ]);
    });
  });

  it('should recognize two tables', () => {
    let ds = dataset({ tables: tablesFn })(arr);
    expect(ds.tables()).to.eql(['cube', 'othercube']);
  });
});
