import { qTable } from '../../../../src/q/data/q-table';
import { qField } from '../../../../src/q/data/q-field';

describe('qTable', () => {
  let q;
  beforeEach(() => {
    q = qTable(qField);
    q.data({
      qSize: { qcx: 3, qcy: 20 },
      qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
      qMeasureInfo: [{ qFallbackTitle: 'C' }],
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
    expect(q.fields().length).to.equal(3);
  });

  it('should find a dimension field', () => {
    expect(q.findField('/qDimensionInfo/0').title()).to.equal('A');
  });

  it('should find a measure field', () => {
    expect(q.findField('/qMeasureInfo/0').title()).to.equal('C');
  });

  it('should find a dimension field by title', () => {
    expect(q.findField('A').title()).to.equal('A');
  });

  it('should find a measure field by title', () => {
    expect(q.findField('C').title()).to.equal('C');
  });

  it('should return undefined when field can not be found', () => {
    expect(q.findField('asd')).to.equal(undefined);
  });
});
