import resolve from '../../../../src/core/style/resolver';

describe('style-resolver', () => {
  /* eslint quote-props: 0 */
  it('should resolve a primitive reference', () => {
    const s = resolve({ font: '$font-family' }, { '$font-family': 'Arial' });
    expect(s).to.eql({
      font: 'Arial'
    });
  });

  it('should resolve a mixin reference', () => {
    const s = resolve({ label: '$label--big' }, { '$label--big': { fontFamily: 'Arial', fontSize: '12px' } });
    expect(s).to.eql({
      label: {
        fontFamily: 'Arial',
        fontSize: '12px'
      }
    });
  });

  it('should not include variables', () => {
    const s = resolve({
      '$fill': 'red',
      font: 'foo',
      color: '$fill'
    }, {});
    expect(s).to.eql({
      font: 'foo',
      color: 'red'
    });
  });

  it('should resolve a mixin reference which in turn has references', () => {
    const references = {
      '$size--m': '12px',
      '$label--big': {
        fontFamily: 'Arial',
        fontSize: '$size--m'
      }
    };
    const input = { label: '$label--big' };
    const s = resolve(input, references);
    expect(s).to.eql({
      label: {
        fontFamily: 'Arial',
        fontSize: '12px'
      }
    });
  });

  it('should resolve an extended mixin', () => {
    const references = {
      '$size--l': '24px',
      '$label--m': {
        fontFamily: 'Arial',
        fontVariant: 'small-caps',
        fontSize: '12px'
      },
      '$label--big': {
        '@extend': '$label--m',
        fontSize: '$size--l'
      }
    };
    const input = { label: '$label--big' };
    const s = resolve(input, references);
    expect(s).to.eql({
      label: {
        fontFamily: 'Arial',
        fontSize: '24px',
        fontVariant: 'small-caps'
      }
    });
  });

  it('should throw error when finding a cyclical reference', () => {
    const references = {
      '$label--big': {
        fontFamily: 'Arial',
        fontSize: '$label--big'
      }
    };
    const input = { label: '$label--big' };
    const fn = () => resolve(input, references);
    expect(fn).to.throw('Cyclical reference for "$label--big"');
  });
});
