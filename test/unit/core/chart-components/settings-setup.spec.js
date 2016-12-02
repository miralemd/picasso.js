import resolveSettingsForPath from '../../../../src/core/chart-components/settings-setup';

describe('Settings setup', () => {
  let settings,
    composer,
    nullComposer;
  beforeEach(() => {
    settings = {
      fontSize: '13px',
      stroke: function stroke(item, index) {
        return index < 2 ? 'style.stroke' : undefined;
      },
      box: {
        width: 1.2,
        fill: 'rgba(0, 0, 0, 0.2)',
        opacity: {
          source: '/qMeasureInfo/1',
          fn: function fn(index) {
            return index > 1 ? 0.5 : undefined;
          }
        }
      },
      whisker: {
        type: 'circle',
        fill: 'red',
        width: 1
      },
      med: {
        stroke: '#00f',
        strokeWidth: 6,
        fill: 0
      },
      line: {
        stroke: function stroke(item, index) {
          return index < 1 ? 'style.line.stroke' : undefined;
        },
        strokeWidth: {
          fn: function fn() {
            return 5;
          },
          source: '/qMeasureInfo/1'
        },
        fill: { source: '/qMeasureInfo/0', type: 'color' }
      },
      title: {
        nullValue: null
      }
    };

    nullComposer = {
      scale() {
        return function () { return undefined; };
      }
    };
    composer = {
      scale() {
        return function () { return 'compost'; };
      }
    };
  });
  it('should use custom scale if not-null', () => {
    const result = resolveSettingsForPath(settings, { line: { fill: 'filling' } }, composer, 'line');
    expect(result.fill.fn()).to.equal('compost');
  });
  it('should add fallback if custom scale', () => {
    const result = resolveSettingsForPath(settings, { line: { fill: 'filling' } }, nullComposer, 'line');
    expect(result.fill.fn()).to.equal('filling');
  });
  it('should add fallback if custom fn', () => {
    const result = resolveSettingsForPath(settings, { box: { opacity: '!transparency' } }, composer, 'box');
    expect(result.opacity.fn(2)).to.equal(0.5);
    expect(result.opacity.fn(0)).to.equal('!transparency');
  });
  it('should add fallback if custom fn no root', () => {
    const result = resolveSettingsForPath(settings, { box: { opacity: '!transparency' } }, composer, 'box');
    expect(result.opacity.fn(2)).to.equal(0.5);
    expect(result.opacity.fn(0)).to.equal('!transparency');
  });
  it('should handle explicitly set null value', () => {
    const result = resolveSettingsForPath(settings, { title: { nullValue: '2' } }, composer, 'title');
    expect(result.nullValue).to.equal(null);
  });
});
