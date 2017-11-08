import {
  hierarchy
} from 'd3-hierarchy';
import hBand from '../../../../src/core/scales/h-band';


describe('Hierarchical band scale', () => {
  const childGen = d => ({ value: d });
  let scale;
  let data;
  let settings;

  beforeEach(() => {
    const leftChildren = ['A', 'B', 'C'].map(childGen);
    const rightChildren = ['D', 'E'].map(childGen);
    data = {
      root: hierarchy({
        value: 'root',
        children: [{
          value: 'left',
          children: leftChildren
        },
        {
          value: 'right',
          children: rightChildren
        }]
      })
    };

    settings = {
    };
  });

  describe('domain', () => {
    it('should have empty domain as default', () => {
      scale = hBand();
      expect(scale.domain()).to.deep.equal([]);
      expect(scale.range()).to.deep.equal([0, 1]);
    });

    it('should set domain to leaf nodes and inject spacer values for each branch node', () => {
      scale = hBand(settings, data);
      expect(scale.domain()).to.deep.equal(['left,A', 'left,B', 'left,C', 'SPACER_0_SPACER', 'right,D', 'right,E']);
    });
  });

  describe('range', () => {
    it('should use a normalized range', () => {
      scale = hBand(settings, data);
      expect(scale.range()).to.deep.equal([0, 1]);
    });

    it('should support invert', () => {
      settings.invert = true;
      scale = hBand(settings, data);
      expect(scale.range()).to.deep.equal([1, 0]);
    });
  });

  describe('labels', () => {
    it('should return labels for leaf nodes', () => {
      scale = hBand(settings, data);
      expect(scale.labels()).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
    });
  });

  describe('bandwidth', () => {
    it('should return correct bandwidth for leaf nodes', () => {
      scale = hBand(settings, data);
      expect(scale.bandwidth()).to.approximately(0.166, 0.001);
      expect(scale.bandwidth(['left', 'B'])).to.approximately(0.166, 0.001);
    });

    it('should return correct bandwidth for a branch node', () => {
      scale = hBand(settings, data);
      expect(scale.bandwidth(['left'])).to.approximately(0.500, 0.001);
      expect(scale.bandwidth(['right'])).to.approximately(0.333, 0.001);
    });

    it('should return leaf node bandwidth for unkown input', () => {
      scale = hBand(settings, data);
      expect(scale.bandwidth(['unknown'])).to.approximately(0.166, 0.001);
    });
  });

  describe('step', () => {
    it('should return correct step size for leaf nodes', () => {
      scale = hBand(settings, data);
      expect(scale.step()).to.approximately(0.166, 0.001);
      expect(scale.step(['left', 'B'])).to.approximately(0.166, 0.001);
    });

    it('should return correct step size for a branch nodes', () => {
      scale = hBand(settings, data);
      expect(scale.step(['left'])).to.approximately(0.500, 0.001);
      expect(scale.step(['right'])).to.approximately(0.333, 0.001);
    });

    it('should return leaf node step size for unknown input', () => {
      scale = hBand(settings, data);
      expect(scale.step(['unknown'])).to.approximately(0.166, 0.001);
    });
  });

  describe('value', () => {
    it('should return correct value for a leaf node', () => {
      scale = hBand(settings, data);
      expect(scale(['left', 'C'])).to.approximately(0.333, 0.001);
      expect(scale(['right', 'D'])).to.approximately(0.666, 0.001);
    });

    it('should return correct value for a branch node', () => {
      scale = hBand(settings, data);
      expect(scale(['left'])).to.equal(0);
      expect(scale(['right'])).to.approximately(0.666, 0.001);
    });

    it('should handle unknown input', () => {
      scale = hBand(settings, data);
      expect(scale(['unkown'])).to.equal(undefined);
    });

    it('should return correct value when inverted', () => {
      settings.invert = true;
      scale = hBand(settings, data);
      expect(scale(['left', 'C'])).to.approximately(0.5, 0.001);
      expect(scale(['right', 'D'])).to.approximately(0.166, 0.001);
    });
  });

  describe('datum', () => {
    it('should return node data value', () => {
      scale = hBand(settings, data);
      expect(scale.datum(['left', 'C'])).to.deep.equal({ value: 'C' });
      expect(scale.datum(['right', 'D'])).to.deep.equal({ value: 'D' });
      expect(scale.datum(['right'])).to.deep.include({ value: 'right' });
    });

    it('should handle unknown input', () => {
      scale = hBand(settings, data);
      expect(scale.datum(['left', 'unknown'])).to.equal(null);
    });
  });

  describe('ticks', () => {
    it('should return ticks for each leaf node', () => {
      scale = hBand(settings, data);
      const ticks = scale.ticks();
      expect(ticks).to.deep.equal([
        { data: { value: 'A' }, label: 'A', position: 0.08333333333333333 },
        { data: { value: 'B' }, label: 'B', position: 0.25 },
        { data: { value: 'C' }, label: 'C', position: 0.41666666666666663 },
        { data: { value: 'D' }, label: 'D', position: 0.75 },
        { data: { value: 'E' }, label: 'E', position: 0.9166666666666666 }
      ]);
    });
  });

  describe.skip('pxScale', () => { // Not implemented yet

  });
});
