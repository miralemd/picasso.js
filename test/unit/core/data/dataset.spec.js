import dataset from '../../../../src/core/data/dataset';

describe('dataset', () => {
  const arr = [
    { name: 'cube', data: {} },
    { name: 'othercube', data: {} }
  ];

  const tablesFn = function tablesFn(data) {
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

  describe('findField', () => {
    let ds;
    before(() => {
      const data = [
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
      const f = ds.findField('/1/1');
      expect(f.table.id()).to.equal('/1');
      expect(f.field.id()).to.equal('/1');
      expect(f.field.values()).to.eql([
        { value: 56, label: '56', id: '56' },
        { value: 59, label: '59', id: '59' }
      ]);
    });
  });

  it('should recognize two tables', () => {
    const ds = dataset({ tables: tablesFn })(arr);
    expect(ds.tables()).to.eql(['cube', 'othercube']);
  });
});
