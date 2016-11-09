import { qTable } from '../../../../../src/core/data/q/q-table';

describe('qTable', () => {
  let q,
    fieldFn = () => {
      const field = () => {};
      field.data = d => d.meta.name;
      return field;
    };
  beforeEach(() => {
    q = qTable(fieldFn);
    q.data({
      qSize: { qcx: 3, qcy: 20 },
      qDimensionInfo: [{ name: 'A' }, { name: 'B' }],
      qMeasureInfo: [{ name: 'C' }],
      qDataPages: [{}]
    });
  });

  it('should return number of rows', () => {
    expect(q.rows()).to.equal(20);
  });

  it('should return number of cols', () => {
    expect(q.cols()).to.equal(3);
  });

  it('should have 3 fields', () => {
    expect(q.fields()).to.deep.equal(['A', 'B', 'C']);
  });

  it('should find a dimension field', () => {
    expect(q.findField('/qDimensionInfo/0')).to.equal('A');
  });

  it('should find a measure field', () => {
    expect(q.findField('/qMeasureInfo/0')).to.equal('C');
  });

  it('should return undefined when field can not be found', () => {
    expect(q.findField('asd')).to.equal(undefined);
  });
});
