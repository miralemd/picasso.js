import * as picasso from '../../../../src/index';

import initPlugin, { qTable } from '../../../../plugins/q/src/q';

describe('qTable', () => {
  beforeEach(() => {
    initPlugin(picasso);
  });

  describe('hypercube', () => {
    let q;
    beforeEach(() => {
      q = qTable({
        localeInfo: 'locale specific stuff',
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [{ qFallbackTitle: 'A' }, { qFallbackTitle: 'B' }],
          qMeasureInfo: [{ qFallbackTitle: 'C' }],
          qDataPages: [{ qMatrix: [] }]
        }
      });
    });
  /*
    it('should return number of rows', () => {
      expect(q.rows()).to.equal(20);
    });

    it('should return number of cols', () => {
      expect(q.cols()).to.equal(3);
    });
  */
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

    it('should have proper data sent to a field', () => {
      expect(q.findField('C').data()).to.eql({
        meta: { qFallbackTitle: 'C' },
        pages: [{ qMatrix: [] }],
        idx: 2,
        localeInfo: 'locale specific stuff'
      });
    });
  });

  describe('hypercube with attribute expressions/dimensions', () => {
    let q;
    beforeEach(() => {
      q = qTable({
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [
            {
              qFallbackTitle: 'A',
              qAttrDimInfo: [{}, {
                id: 'yes',
                label: 'title from label',
                qFallbackTitle: 'attr dim title',
                qSize: {},
                qDataPages: 'attr dim table pages'
              }],
              qAttrExprInfo: [{
                id: 'yes',
                qFallbackTitle: 'attr expr title'
              }]
            },
            { qFallbackTitle: 'B' }
          ],
          qMeasureInfo: [
            {},
            {},
            {
              qFallbackTitle: 'C',
              qAttrDimInfo: [{}, {}, {
                id: 'yes',
                qFallbackTitle: 'm attr dim title'
              }],
              qAttrExprInfo: [{}, {
                id: 'yes',
                qFallbackTitle: 'm attr expr title'
              }]
            }
          ],
          qDataPages: [{ qMatrix: [] }]
        },
        localeInfo: 'locale stuff'
      });
    });

    it('should find an attribute expression field on dimension', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrExprInfo/0').title()).to.equal('attr expr title');
    });

    it('should have data on attr expr field found on dimension', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrExprInfo/0').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'attr expr title' },
        pages: [{ qMatrix: [] }],
        idx: 0,
        attrIdx: 0,
        localeInfo: 'locale stuff'
      });
    });

    it('should find an attribute expression field on measure', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrExprInfo/1').title()).to.equal('m attr expr title');
    });

    it('should have data on attr expr field found on measure', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrExprInfo/1').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'm attr expr title' },
        pages: [{ qMatrix: [] }],
        idx: 4,
        attrIdx: 1,
        localeInfo: 'locale stuff'
      });
    });

    it('should find an attribute dimension on dimension', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrDimInfo/1').title()).to.equal('title from label');
    });

    it('should identify an attribute dimension as type "dimension"', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrDimInfo/1').type()).to.equal('dimension');
    });

    it('should return cached field instances when called multiple times', () => {
      let ff = q.findField('/qDimensionInfo/0/qAttrDimInfo/1');
      let ff2 = q.findField('/qDimensionInfo/0/qAttrDimInfo/1');
      expect(ff).to.equal(ff2);
    });

    it('should have data on attr dim field found on dimension', () => {
      expect(q.findField('/qDimensionInfo/0/qAttrDimInfo/1').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'attr dim title', label: 'title from label', qSize: {}, qDataPages: 'attr dim table pages' },
        pages: [{ qMatrix: [] }],
        idx: 0,
        attrDimIdx: 1,
        localeInfo: 'locale stuff'
      });
    });

    it('should find an attribute dimension field on measure', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrDimInfo/2').title()).to.equal('m attr dim title');
    });

    it('should have data on attr dim field found on measure', () => {
      expect(q.findField('/qMeasureInfo/2/qAttrDimInfo/2').data()).to.eql({
        meta: { id: 'yes', qFallbackTitle: 'm attr dim title' },
        pages: [{ qMatrix: [] }],
        idx: 4,
        attrDimIdx: 2,
        localeInfo: 'locale stuff'
      });
    });
  });

  describe('stackedobject', () => {
    let q;
    let pages;
    beforeEach(() => {
      pages = [
        { qData: [
          {
            qType: 'R',
            qElemNo: 0,
            qSubNodes: [
              {
                qText: 'Alpha',
                qElemNo: 1,
                qValue: 'NaN'
              },
              {
                qText: 'Beta',
                qElemNo: 3,
                qValue: 2
              }
            ]
          }
        ] }
      ];
      q = qTable({
        cube: {
          qSize: { qcx: 3, qcy: 20 },
          qDimensionInfo: [
            { qFallbackTitle: 'A' },
            {
              qFallbackTitle: 'B',
              qAttrDimInfo: [{}, {}, { label: 'attr dim' }],
              qAttrExprInfo: [{ label: 'attr expr' }]
            }],
          qMeasureInfo: [{
            qFallbackTitle: 'C',
            qAttrDimInfo: [{ label: 'm attr dim' }],
            qAttrExprInfo: [{}, { label: 'm attr expr' }]
          }],
          qMode: 'K',
          qEffectiveInterColumnSortOrder: [1, 0],
          qStackedDataPages: pages
        },
        localeInfo: 'locale specific stuff'
      });
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

    it('should find an attribute dimension field on a dimension', () => {
      expect(q.findField('/qDimensionInfo/1/qAttrDimInfo/2').title()).to.equal('attr dim');
    });

    it('should have data on attr dim field found on dimension', () => {
      expect(q.findField('/qDimensionInfo/1/qAttrDimInfo/2').data()).to.eql({
        meta: { label: 'attr dim' },
        pages,
        idx: 0,
        attrDimIdx: 2,
        localeInfo: 'locale specific stuff'
      });
    });

    it('should find an attribute dimension field on a measure', () => {
      expect(q.findField('/qMeasureInfo/0/qAttrDimInfo/0').title()).to.equal('m attr dim');
    });

    it('should find an attribute expression field on a dimension', () => {
      expect(q.findField('/qDimensionInfo/1/qAttrExprInfo/0').title()).to.equal('attr expr');
    });

    it('should find an attribute expression field on a measure', () => {
      expect(q.findField('/qMeasureInfo/0/qAttrExprInfo/1').title()).to.equal('m attr expr');
    });

    it('should should have locale data', () => {
      expect(q.findField('/qMeasureInfo/0').data().localeInfo).to.eql('locale specific stuff');
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

    it('should have values', () => {
      expect(q.findField('/qDimensionInfo/1').values()).to.eql([
        { value: 'NaN', label: 'Alpha', id: 1, index: 0 },
        { value: 2, label: 'Beta', id: 3, index: 1 }
      ]);
    });
  });

  describe('listobject', () => {
    let q;
    beforeEach(() => {
      q = qTable({ cube: {
        qSize: { qcx: 3, qcy: 20 },
        qDimensionInfo: { qFallbackTitle: 'A' },
        qDataPages: [{ qArea: { qTop: 0, qLeft: 0, qHeight: 20, qWidth: 1 },
          qMatrix: [
            [{ qNum: 17, qText: 'alpha', qElemNumber: 3 }],
            [{ qNum: 'NaN', qText: 'beta', qElemNumber: 4 }],
            [{ qNum: null, qText: 'gamma', qElemNumber: 5 }]
          ] }]
      } });
    });
    it('should have 1 fields', () => {
      expect(q.fields().length).to.equal(1);
    });

    it('should find a dimension field', () => {
      expect(q.findField('/qDimensionInfo').title()).to.equal('A');
    });

    it('should find a dimension field by title', () => {
      expect(q.findField('A').title()).to.equal('A');
    });

    it('should have values', () => {
      expect(q.findField('A').values()).to.eql([
        { value: 17, label: 'alpha', id: 3, index: 0 },
        { value: 'NaN', label: 'beta', id: 4, index: 1 },
        { value: null, label: 'gamma', id: 5, index: 2 }
      ]);
    });
  });

  describe('attribute dimension table', () => {
    let q;
    beforeEach(() => {
      q = qTable({
        cube: {
          label: 'title label',
          qFallbackTitle: 'attr title',
          qSize: { qcx: 2, qcy: 20 },
          qDataPages: [{ qMatrix: [] }]
        },
        localeInfo: 'locale stuff'
      }, { id: 'legendData/qAttrDimInfo/1/0' });
    });

    it('should find the first field', () => {
      let f = q.findField('/0');
      expect(f.title()).to.equal('title label');
    });

    it('should find the second field', () => {
      let f = q.findField('/1');
      expect(f.title()).to.equal('$unknown');
    });
  });
});
