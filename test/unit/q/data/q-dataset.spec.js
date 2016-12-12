import qDataset from '../../../../src/q/data/q-dataset';

describe('qdataset', () => {
  const layout = {
    foo: {
      qHyperCube: 'foo-data'
    },
    layers: [
      { qHyperCube: 'layers-0-data' },
      { qHyperCube: 'layers-1-data' }
    ],
    lists: [
      {
        first: {
          qListObject: 'lista'
        }
      }
    ],
    qDummy: {
      qHyperCube: 'foo-nope'
    },
    qListObject: 'liistaa',
    qHyperCube: 'root-data'
  };

  let d;

  beforeEach(() => {
    d = qDataset()(layout);
  });

  it('should create 6 tables', () => {
    expect(d.tables().length).to.equal(6);
  });

  it('should identify tables', () => {
    const tables = d.tables();
    expect(tables[0].id()).to.equal('/foo/qHyperCube');
    expect(tables[1].id()).to.equal('/layers/0/qHyperCube');
    expect(tables[2].id()).to.equal('/layers/1/qHyperCube');
    expect(tables[3].id()).to.equal('/lists/0/first/qListObject');
    expect(tables[4].id()).to.equal('/qListObject');
    expect(tables[5].id()).to.equal('/qHyperCube');
  });

  it('should have tables with data', () => {
    const tables = d.tables();
    expect(tables[0].data()).to.equal('foo-data');
    expect(tables[1].data()).to.equal('layers-0-data');
    expect(tables[2].data()).to.equal('layers-1-data');
    expect(tables[3].data()).to.equal('lista');
    expect(tables[4].data()).to.equal('liistaa');
    expect(tables[5].data()).to.equal('root-data');
  });
});
