import resolveInitialSettings from '../../../../../../src/core/chart-components/markers/generic/settings-setup';

describe('Settings setup', () => {
  let settings,
    composer,
    nullComposer;
  beforeEach(() => {
    settings = {
      stroke: 'stroke',
      fontSize: '13px',
      style: {
        stroke: function stroke(item, index) {
          return index < 2 ? 'style.stroke' : null;
        },
        box: {
          width: 1.2,
          fill: 'rgba(0, 0, 0, 0.2)',
          opacity: {
            source: '/qMeasureInfo/1',
            fn: function fn(index) {
              return index > 1 ? 0.5 : null;
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
            return index < 1 ? 'style.line.stroke' : null;
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
          main: {

          }
        }
      }
    };

    nullComposer = {
      scale() {
        return function () { return null; };
      }
    };
    composer = {
      scale() {
        return function () { return 'compost'; };
      }
    };
  });
  it('should use custom scale if not-null', () => {
    const result = resolveInitialSettings(settings, { line: { fill: 'filling' } }, composer, 'style');
    expect(result.line.fill()).to.equal('compost');
  });
  it('should add fallback if custom scale', () => {
    const result = resolveInitialSettings(settings, { line: { fill: 'filling' } }, nullComposer, 'style');
    expect(result.line.fill()).to.equal('filling');
  });
  it('should add fallback if custom fn', () => {
    const result = resolveInitialSettings(settings, { box: { opacity: '!transparency' } }, composer, 'style');
    expect(result.box.opacity(2)).to.equal(0.5);
    expect(result.box.opacity(0)).to.equal('!transparency');
  });
  it('should add fallback if custom fn no root', () => {
    const result = resolveInitialSettings(settings.style, { box: { opacity: '!transparency' } }, composer);
    expect(result.box.opacity(2)).to.equal(0.5);
    expect(result.box.opacity(0)).to.equal('!transparency');
  });
});
