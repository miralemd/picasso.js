 import ordinal from '../../../../src/core/scales/ordinal';

 describe('OrdinalScale', () => {
   let scale;
   beforeEach(() => {
     scale = ordinal();
   });

   it('should have empty domain as default', () => {
     expect(scale.domain()).to.deep.equal([]);
     expect(scale.range()).to.deep.equal([0, 1]);
   });

  // Current ordinal is a band scale, so range is a number

  /* it.only('should accept domain and range parameters', () => {
    scale = ordinal().domain(['Jan', 'Apr']).range(['Q1', 'Q2']);
    expect(scale.domain()).to.deep.equal(['Jan', 'Apr']);
    expect(scale.range()).to.deep.equal(['Q1', 'Q2']);
  });

  it('should return assigned value when called without arguments', () => {
    scale.domain(['Jan', 'Apr']).range(['Q1', 'Q2']).unknown('unk');
    expect(scale.domain()).to.deep.equal(['Jan', 'Apr']);
    expect(scale.range()).to.deep.equal(['Q1', 'Q2']);
    expect(scale.unknown()).to.deep.equal('unk');
  });

  it('should follow string coersion for domain matching', () => {
    const x = { y: 1 };
    scale.domain([1, 0.2, 'str', [1, 2], -0, NaN, x, undefined, null, Infinity, -Infinity, true, false, -1, []])
       .range(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15']);
    expect(scale.get(1)).to.deep.equal('Q1');
    expect(scale.get('1')).to.deep.equal('Q1');
    expect(scale.get(0.2)).to.deep.equal('Q2');
    expect(scale.get('0.2')).to.deep.equal('Q2');
    expect(scale.get('str')).to.deep.equal('Q3');
    expect(scale.get(new String('str'))).to.deep.equal('Q3'); // eslint-disable-line no-new-wrappers
    expect(scale.get([1, 2])).to.deep.equal('Q4');
    expect(scale.get(-0)).to.deep.equal('Q5');
    expect(scale.get(+0)).to.deep.equal('Q5');
    expect(scale.get(0)).to.deep.equal('Q5');
    expect(scale.get(NaN)).to.deep.equal('Q6');
    expect(scale.get(x)).to.deep.equal('Q7');
    expect(scale.get({ y: 1 })).to.deep.equal('Q7');
    expect(scale.get({})).to.deep.equal('Q7');
    expect(scale.get(undefined)).to.deep.equal('Q8');
    expect(scale.get(null)).to.deep.equal('Q9');
    expect(scale.get(Infinity)).to.deep.equal('Q10');
    expect(scale.get(-Infinity)).to.deep.equal('Q11');
    expect(scale.get(true)).to.deep.equal('Q12');
    expect(scale.get('true')).to.deep.equal('Q12');
    expect(scale.get(false)).to.deep.equal('Q13');
    expect(scale.get('false')).to.deep.equal('Q13');
    expect(scale.get(-1)).to.deep.equal('Q14');
    expect(scale.get('-1')).to.deep.equal('Q14');
    expect(scale.get([])).to.deep.equal('Q15');
    expect(scale.get('')).to.deep.equal('Q15');
  });

  it('should scale a disrete domain and range', () => {
    scale.domain(['Jan', 'Apr']).range(['Q1', 'Q2']);
    expect(scale.get('Jan')).to.deep.equal('Q1');
    expect(scale.get('Apr')).to.deep.equal('Q2');
  });

  it('should return specified unknown value if input value is unknown', () => {
    scale.domain(['Jan', 'Apr'])
      .range(['Q1', 'Q2'])
      .unknown('nope');
    expect(scale.get('Oct')).to.deep.equal('nope');
  });

  it('should return next available range value if input value is unknown', () => {
    scale.range(['Q1', 'Q2']);
    expect(scale.get('some random value')).to.deep.equal('Q1');
    expect(scale.get('some random value 2')).to.deep.equal('Q2');
    expect(scale.get('some random value 3')).to.deep.equal('Q1');
    expect(scale.get('some random value 4')).to.deep.equal('Q2');
  });

  it('should reuse range values if there are fewer values in range then domain', () => {
    scale.domain(['Jan', 'Apr', 'Qct', 'Dec']).range(['Q1', 'Q2']);
    expect(scale.get('Jan')).to.deep.equal('Q1');
    expect(scale.get('Apr')).to.deep.equal('Q2');
    expect(scale.get('Oct')).to.deep.equal('Q1');
    expect(scale.get('Dec')).to.deep.equal('Q2');
  });

  it('should have start/end depend on domain', () => {
    scale.domain(['Jan', 'Apr', 'Qct', 'Dec']).range(['Q1', 'Q2', 'Q3', 'Q4']);
    expect(scale.start).to.equal('Jan');
    expect(scale.end).to.equal('Dec');
  });*/
 });
