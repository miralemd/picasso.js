import * as picasso from '../../../../src/index';

import initPlugin, { qDataset } from '../../../../plugins/q/src/q';

describe('qdataset', () => {
  const layout = {
    qLocaleInfo: 'locale stuff',
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
    simple: true,
    fn: () => {},
    nil: null,
    qDummy: {
      qHyperCube: 'foo-nope'
    },
    qListObject: 'liistaa',
    qHyperCube: 'root-data',
    attrs: {
      qHyperCube: {
        qDimensionInfo: [
          {
            qFallbackTitle: 'A',
            qAttrDimInfo: ['colors']
          },
          { qFallbackTitle: 'B' }
        ],
        qMeasureInfo: [{}, { qAttrDimInfo: ['polygons', 'regions'] }]
      }
    }
  };

  let d;

  beforeEach(() => {
    initPlugin(picasso);
    d = qDataset(layout);
  });

  it('should create 10 tables', () => {
    expect(d.tables().length).to.equal(10);
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

  it('should identify attribute dimension tables', () => {
    const tables = d.tables();
    expect(tables[7].id()).to.equal('/attrs/qHyperCube/qDimensionInfo/0/qAttrDimInfo/0');
    expect(tables[9].id()).to.equal('/attrs/qHyperCube/qMeasureInfo/1/qAttrDimInfo/1');
  });

  it('should have tables with data', () => {
    const tables = d.tables();
    expect(tables[0].data()).to.eql({ cube: 'foo-data', localeInfo: 'locale stuff' });
    expect(tables[1].data()).to.eql({ cube: 'layers-0-data', localeInfo: 'locale stuff' });
    expect(tables[2].data()).to.eql({ cube: 'layers-1-data', localeInfo: 'locale stuff' });
    expect(tables[3].data()).to.eql({ cube: 'lista', localeInfo: 'locale stuff' });
    expect(tables[4].data()).to.eql({ cube: 'liistaa', localeInfo: 'locale stuff' });
    expect(tables[5].data()).to.eql({ cube: 'root-data', localeInfo: 'locale stuff' });
  });

  it('should have attribute dimension tables with data', () => {
    const tables = d.tables();
    expect(tables[7].data()).to.eql({ cube: 'colors', localeInfo: 'locale stuff' });
    expect(tables[9].data()).to.eql({ cube: 'regions', localeInfo: 'locale stuff' });
  });

  it('should find table containing attr dim field', () => {
    expect(d.findField('/attrs/qHyperCube/qMeasureInfo/1/qAttrDimInfo/1').table.id()).to.equal('/attrs/qHyperCube');
  });

  it('should find attr dim table', () => {
    expect(d.findField('/attrs/qHyperCube/qMeasureInfo/1/qAttrDimInfo/1/0').table.id())
      .to.equal('/attrs/qHyperCube/qMeasureInfo/1/qAttrDimInfo/1');
  });
});
