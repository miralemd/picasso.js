import { createFromMetaInfo } from '../../../../src/q/formatter';

describe('qs-formatter', () => {
  it('should create a numeric formatter by default', () => {
    const f = createFromMetaInfo();
    expect(f.pattern()).to.equal('#');
  });
  it('should create an abbreviation formatter when qIsAutoFormat=true', () => {
    const f = createFromMetaInfo({
      qIsAutoFormat: true
    });
    expect(f.pattern()).to.equal('#.##A');
  });

  it('should not create an abbreviation formatter when qType="M"', () => {
    const f = createFromMetaInfo({
      qNumFormat: {
        qType: 'M',
        qFmt: 'money!'
      },
      qIsAutoFormat: true
    });
    expect(f.pattern()).to.equal('money!');
  });
});
